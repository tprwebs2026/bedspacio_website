import express from 'express';
import axios from 'axios'
import { searchRead, readByIds, executeKw, createInquiryRecord, createCrmRecord } from '../odoo/odoo.service.js';
import { db } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import { roomImage } from '../middleware/multer.js';
import { customAlphabet } from 'nanoid'

import fs from 'fs/promises'
import path from 'path'

const roomRoute = express.Router();

/*
    THIS ROUTE WILL BE USED TO RETRIEVE INFORMATION ABOUT:
    > room listings
    > room in-depth information
    > room images
*/


roomRoute.get('/v1/listing' , async (req, res) => {
    try {
        const domain = [];
        const page = Math.max(Number(req.query.page) || 1, 1);
        const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 8, 1), 50);
        const offset = (page - 1) * pageSize;

        const roomType = req.query.room_type;
        const branchFilter = Number(req.query.branch);
        const minBudget = Number(req.query.minimumBudget);
        const maxBudget = Number(req.query.maximumBudget);
        const inclusionfilter = req.query.inclusion;

        if (roomType) domain.push(["room_type", "=", roomType]);
        if (branchFilter) domain.push(["branch_id", "=", branchFilter]); // get the id to filter branch
        if (minBudget) domain.push(["starting_price", ">=", minBudget]);
        if (maxBudget) domain.push(["starting_price", "<=", maxBudget]);


        if (inclusionfilter) {
            const slugs = Array.isArray(inclusionfilter) ? inclusionfilter : [inclusionfilter]

            const matchedInclusions = await searchRead({
                model: "bedspacio.room.inclusion",
                domain: [["slug", "in", slugs]],
                fields: ["id", "slug"]
            });

            const inclusionIds = matchedInclusions.map(inc => inc.id);

            if (inclusionIds.length) {
                inclusionIds.forEach(id => {
                    domain.push(["inclusion_ids", "in", [id]]);
                });
            }
        }

        const totalItems = await executeKw({
            model: "bedspacio.room",
            method: "search_count",
            kwargs: { domain }
        });

        const totalPages = Math.ceil(totalItems / pageSize)

        const rooms = await searchRead({
            model: "bedspacio.room",
            domain,
            fields: [ 
                "room_name", 
                "room_type", 
                "gender", 
                "starting_price", 
                "is_available", 
                'image_ids', 
                "branch_id", 
                "inclusion_ids" 
            ],
            limit: pageSize,
            offset: offset,
            order: "id desc"
        });

        const inclusionIds = [...new Set(rooms.flatMap(room => room.inclusion_ids || []))];

        const inclusions = inclusionIds.length
            ? await readByIds({
                model: "bedspacio.room.inclusion",
                ids: inclusionIds,
                fields: ["name", "slug"]
            })
            : [];

        console.log('INclusion with slug: ', inclusions);
        const inclusionMap = Object.fromEntries(inclusions.map(inc => [inc.id, inc]));


        const items = rooms.map((room) => {
            const thumbId = room.image_ids?.[0]; // get the first image 

            return {
                id: room.id,
                room_name: room.room_name,
                room_type: room.room_type,
                gender: room.gender,
                price: room.starting_price,
                is_available: room.is_available,
                branch_id: {
                    id: room.branch_id[0],
                    name: room.branch_id[1]
                },
                inclusions: (room.inclusion_ids || [])
                    .map(id => inclusionMap[id])
                    .filter(Boolean),

                thumbnail_image_id: thumbId ?? null // get the first image 
            }
        });

        const pagination =  {
            page,
            pageSize,
            totalItems,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        }

        return res.json({
            items,
            pagination: pagination
        })

    } catch (err) {
        console.error("Room listing error", err);

        return res.status(500).json({
            success: false,
            message: 'Error retrieving room listings',
        })
    }
});



roomRoute.get('/v1/detail/:id', async (req, res, next) => {
    try {

        const room_id  = Number(req.params.id);

        if (!Number.isInteger(room_id) || room_id <= 0) {
            return res.status(400).json({ message: "Invalid room id" });
        }


        const roomDetail = await searchRead({
            model: "bedspacio.room",
            domain: [["id", "=", room_id]],
            fields: [
                "public_room_id",
                "room_name",
                "room_type",
                "description",
                "gender",
                "starting_price",
                "capacity",
                "available_slot",
                "available_upper",
                "available_lower",
                "branch_id",
                "property_manager_id",
                "property_manager_name",
                "property_contact",
                // "profile_image", commented, using filestore now instead of base64
                "inclusion_ids",
                "payment_term_ids",
                "image_ids"
            ],
            limit: 1,
            offset: Number(req.query.offset || 0),
            order: "id asc"
        });

        if (!roomDetail.length) {
            return res.status(404).json({ message: "Room not found" });
        }

        const data = roomDetail[0];
        const branchId = Array.isArray(data.branch_id) ? data.branch_id[0] : null;

        // GET THE FIELDS branch address, landmarks for branch
        const branch = branchId 
            ? await readByIds({
                model: "bedspacio.branch",
                ids: branchId,
                fields: [ 
                    "branch_name",
                    "address", 
                    "landmark_ids",
                ]
            }).then(result => result[0] || null)
            : null;


        // GET THE Landmarks from the landmark_ids retrieved from the branches above
        // TODO: MAP THIS lands
        const landmarks = branch?.landmark_ids?.length
            ? await readByIds({
                model: "bedspacio.landmark",
                ids: branch.landmark_ids,
                fields: [ "name" ]
            }) : []


        // GET THE FIELDS ID, NAME FOR INCLUSIONS
        // get the id and name from inlcusionIds
        const inclusions = data.inclusion_ids.length
            ? await readByIds({
                model: "bedspacio.room.inclusion",
                ids: data.inclusion_ids,
                fields: [ "name", "slug" ]
            }) : []


        // GET THE FIELDS ID, LABEL, AMOUNT FOR PAYMENT TERMS
        // Map the ids for payment_term_ids
        const paymentTerms = data.payment_term_ids.length
            ? await readByIds({
                model: "bedspacio.payment.term",
                ids: data.payment_term_ids,
                fields: [ "label", "amount" ] 
            }) : []


        const images = data.image_ids?.length
            ? await readByIds({
                model: "bedspacio.room.image",
                ids: data.image_ids,
                fields: ["id"]   // you only need id because Odoo serves the image
            })
            : [];

        res.json({
                id:room_id,
                public_room_id: data.public_room_id,
                name: data.room_name,
                type: data.room_type,
                description: data.description,
                gender: data.gender,
                starting_price: data.starting_price,
                capacity: data.capacity,
                available_slot: data.available_slot,
                available_upper: data.available_upper,
                available_lower: data.available_lower,
                branch: branch
                    ? {
                        id: branch.id,
                        name: branch.branch_name,
                        address: branch.address,
                        landmarks: landmarks
                    }
                    : null,
                // property_manager_id: data.property_manager_id?.[0],
                property_manager: data.property_manager_name,
                property_manager_contact: data.property_contact,
                profile_image: `/web/image/bedspacio.property.manager/${data.property_manager_id[0]}/profile_image`,
                inclusions: inclusions,
                payment_terms: paymentTerms,
                images: images.map(img => ({
                    id: img.id,
                    url: `/web/image/bedspacio.room.image/${img.id}/image`
                }))
            });

    } catch (err) {
        console.error("Room detail error: ", err);

        return res.status(500).json({
            sucess: false,
            message: 'Error retrieving room detail'
        });
    }
})


// ---------------------------- POSTGRESQL ----------------------------- //


roomRoute.post('/v1/new-room', requireAuth, roomImage.array('room_image', 6), async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            type,
            slot,
            capacity,
            payment_term,
            gender,
            branch_id,
            inclusions,
            upper_deck_total,
            lower_deck_total,
            upper_deck_available,
            lower_deck_available
        } = req.body;

        const nanoid = customAlphabet('0123456789', 6);
        const room_uuid = nanoid();

        await db.tx(async t => {
            const createdRoom = await t.one(
                `
                INSERT INTO rooms (
                    room_uuid,
                    title,
                    description,
                    price,
                    type,
                    slot,
                    capacity,
                    payment_term,
                    gender,
                    branch_id
                )
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
                RETURNING id, room_uuid, title
                `,
                [
                    room_uuid,
                    title,
                    description,
                    price,
                    type,
                    slot,
                    capacity,
                    payment_term,
                    gender,
                    branch_id
                ]
            );

            const normalizedInclusions = Array.isArray(inclusions)
                ? inclusions
                : [inclusions];

            await Promise.all([
                ...normalizedInclusions.map(inc =>
                    t.none(
                        `
                        INSERT INTO room_inclusions
                        (room_id, inclusion_id)
                        VALUES ($1, $2)
                        `,
                        [createdRoom.id, inc]
                    )
                ),

                ...req.files.map((img, index) =>
                    t.none(
                        `
                        INSERT INTO room_images
                        (room_id, image_url, sort_order)
                        VALUES ($1, $2, $3)
                        `,
                        [createdRoom.id, img.filename, index + 1]
                    )
                )
            ]);

            if (type === 'bedspace') {
                await t.none(
                    `
                    INSERT INTO bedspace_configs (
                        room_id,
                        upper_deck_total,
                        lower_deck_total,
                        upper_deck_available,
                        lower_deck_available
                    )
                    VALUES ($1,$2,$3,$4,$5)
                    `,
                    [
                        createdRoom.id,
                        Number(upper_deck_total),
                        Number(lower_deck_total),
                        Number(upper_deck_available),
                        Number(lower_deck_available)
                    ]
                );
            }

            res.status(200).json({
                message: 'Room created successfully',
                data: createdRoom
            });
        });

    } catch (err) {
        console.error('Error creating new room:', err);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});


// roomRoute.patch('/v1/:id/info', requireAuth, roomImage.array('room_image', 6), async (req, res) => {
//     try {
//         const id = Number(req.params.id);
//         if (isNaN(id)) {
//             throw new Error('Id must be a number');
//         };

//         const room = await db.oneOrNone(
//             `SELECT EXISTS(SELECT 1 FROM rooms WHERE id = $1)`,
//             [id]
//         );

//         if (!room.exists) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Room not found'
//             });
//         }

//         const { inclusions, existing_images, ...roomUpdates } = req.body;

//         if (Object.keys(roomUpdates).length > 0) {
//             const keys = Object.keys(roomUpdates);

//             const setClause = keys  
//                 .map((key, index) => `${key} = $${index + 1}`)
//                 .join(', ');

//             const values = keys.map(key => roomUpdates[key]);

//             await db.oneOrNone(
//                 `
//                 UPDATE rooms
//                 SET ${setClause}
//                 WHERE id = $${keys.length + 1}
//                 RETURNING *
//                 `,
//                 [...values, id]
//             )
//         }

//         if (inclusions?.length) {
//             await db.none(
//                 'DELETE FROM room_inclusions WHERE room_id = $1',
//                 [id]
//             );

//             for (const inc of inclusions) {
//                 await db.none(
//                     `
//                     INSERT INTO room_inclusions
//                     (room_id, inclusion_id)
//                     VALUES ($1, $2)
//                     `,
//                     [id, inc]
//                 )
//             }
//         };

//         const existingImages = existing_images
//             ? JSON.parse(existing_images)
//             : [];

//         const currentImages = await db.any(
//             `
//             SELECT *
//             FROM room_images
//             WHERE room_id = $1
//             `,
//             [id]
//         );

//         // Delete removed images
//         for (const img of currentImages) {
//             if (
//                 !existingImages.includes(
//                     img.image_url
//                 )
//             ) {
//                 const imagePath = path.join(
//                     process.cwd(),
//                     "file/room/image",
//                     img.image_url
//                 );

//                 try {
//                     await fs.unlink(imagePath);
//                     console.log(
//                         "Deleted:",
//                         imagePath
//                     );
//                 } catch (err) {
//                     console.error(
//                         "File delete failed:",
//                         err.message
//                     );
//                 }

//                 await db.none(
//                     `
//                     DELETE FROM room_images
//                     WHERE id = $1
//                     `,
//                     [img.id]
//                 );
//             }
//         }

//         // Add newly uploaded images
//         if (req.files?.length) {
//             const currentCount =
//                 existingImages.length;

//             await Promise.all(
//                 req.files.map((img, index) =>
//                     db.none(
//                         `
//                         INSERT INTO room_images
//                         (room_id, image_url, sort_order)
//                         VALUES ($1, $2, $3)
//                         `,
//                         [
//                             id,
//                             img.filename,
//                             currentCount +
//                                 index +
//                                 1
//                         ]
//                     )
//                 )
//             );
//         }

//         return res.status(200).json({
//             success: true,
//             message: 'Room updated successfully'
//         })


//     } catch (err) {
//         console.log('Error updating room: ', err);

//         return res.status(500).json({
//             success: false,
//             message: 'Internal server error'
//         })
//     }
// });


roomRoute.patch(
    '/v1/:id/info',
    requireAuth,
    roomImage.array('room_image', 6),
    async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                throw new Error('Id must be a number');
            }

            const room = await db.one(
                `SELECT EXISTS(
                    SELECT 1 FROM rooms WHERE id = $1
                ) AS exists`,
                [id]
            );

            if (!room.exists) {
                return res.status(404).json({
                    success: false,
                    message: 'Room not found'
                });
            }

            const {
                inclusions,
                existing_images,

                upper_deck_total,
                lower_deck_total,
                upper_deck_available,
                lower_deck_available,

                ...roomUpdates
            } = req.body;

            // Update room info
            if (Object.keys(roomUpdates).length > 0) {
                const keys = Object.keys(roomUpdates);

                const setClause = keys
                    .map((key, index) => `${key} = $${index + 1}`)
                    .join(', ');

                const values = keys.map(
                    key => roomUpdates[key]
                );

                await db.none(
                    `
                    UPDATE rooms
                    SET ${setClause}
                    WHERE id = $${keys.length + 1}
                    `,
                    [...values, id]
                );
            }

            if (roomUpdates.type === 'apartment') {
                await db.none(
                    `
                    DELETE FROM bedspace_configs
                    WHERE room_id = $1
                    `,
                    [id]
                );
            }

            const hasBedspaceConfig =
                upper_deck_total?.trim() !== '' &&
                lower_deck_total?.trim() !== '' &&
                upper_deck_available?.trim() !== '' &&
                lower_deck_available?.trim() !== '';

            if (hasBedspaceConfig && roomUpdates.type !== 'apartment') {
                await db.none(
                    `
                    INSERT INTO bedspace_configs (
                        room_id,
                        upper_deck_total,
                        lower_deck_total,
                        upper_deck_available,
                        lower_deck_available
                    )
                    VALUES ($1, $2, $3, $4, $5)

                    ON CONFLICT (room_id)
                    DO UPDATE SET
                        upper_deck_total = EXCLUDED.upper_deck_total,
                        lower_deck_total = EXCLUDED.lower_deck_total,
                        upper_deck_available = EXCLUDED.upper_deck_available,
                        lower_deck_available = EXCLUDED.lower_deck_available
                    `,
                    [
                        id,
                        Number(upper_deck_total),
                        Number(lower_deck_total),
                        Number(upper_deck_available),
                        Number(lower_deck_available)
                    ]
                );

                const computedCapacity =
                    Number(upper_deck_total) + Number(lower_deck_total);

                const computedSlot =
                    Number(upper_deck_available) + Number(lower_deck_available);

                await db.none(
                    `
                    UPDATE rooms
                    SET
                        capacity = $1,
                        slot = $2
                    WHERE id = $3
                    `,
                    [computedCapacity, computedSlot, id]
                );
            }

            

            // Update inclusions
            if (inclusions) {
                const parsedInclusions = JSON.parse(inclusions);

                await db.none(
                    `DELETE FROM room_inclusions WHERE room_id = $1`,
                    [id]
                );

                for (const inc of parsedInclusions) {
                    await db.none(
                        `
                        INSERT INTO room_inclusions
                        (room_id, inclusion_id)
                        VALUES ($1, $2)
                        `,
                        [id, inc]
                    );
                }
            }

            // Parse existing images
            let existingImages = [];

            try {
                existingImages = existing_images
                    ? JSON.parse(existing_images)
                    : [];
            } catch {
                existingImages = [];
            }

            const currentImages = await db.any(
                `
                SELECT *
                FROM room_images
                WHERE room_id = $1
                `,
                [id]
            );

            // Delete removed images
            for (const img of currentImages) {
                if (!existingImages.includes(img.image_url)) {
                    const imagePath = path.join(
                        process.cwd(),
                        'file/room/image',
                        img.image_url
                    );

                    try {
                        await fs.unlink(imagePath);
                    } catch (err) {
                        console.error(err.message);
                    }

                    await db.none(
                        `
                        DELETE FROM room_images
                        WHERE id = $1
                        `,
                        [img.id]
                    );
                }
            }

            // Add new uploaded images
            if (req.files && req.files.length > 0) {
                const currentCount = existingImages.length;

                await Promise.all(
                    req.files.map((img, index) =>
                        db.none(
                            `
                            INSERT INTO room_images
                            (room_id, image_url, sort_order)
                            VALUES ($1, $2, $3)
                            `,
                            [
                                id,
                                img.filename,
                                currentCount + index + 1
                            ]
                        )
                    )
                );
            }

            return res.status(200).json({
                success: true,
                message: 'Room updated successfully'
            });

        } catch (err) {
            console.error('Error updating room:', err);

            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
);



roomRoute.get('/v1/admin/all', async (req, res) => {
    try {

        const branch = req.query.branch
        const page = Number(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const allRooms = await db.manyOrNone(
            `SELECT
                r.id, 
                r.room_uuid,
                r.title,
                r.branch_id,
                r.type,
                r.slot,
                r.price,
                br.name as branch
            FROM rooms r
            JOIN branches br ON br.id = r.branch_id
            ORDER BY r.created_at DESC
            LIMIT $1 OFFSET $2;
            `, [ limit, offset ]
        );

        const totalRooms = await db.one(
            `SELECT COUNT(*) FROM rooms`
        );

        const totalPage = Math.ceil(Number(totalRooms.count) / limit)


        if (allRooms.length === 0) {
            return res.status(200).json({
                message: 'No data found for rooms',
                data: []
            });
        }

        return res.status(200).json({
            data: allRooms,
            currentPage: page,
            totalPage: totalPage
        })

    } catch (err) {
        console.error('Error retrieving rooms: ', err);
        return res.status(500).json({ message: 'Internal server error' })
    }
})


// QUERY for single room
// roomRoute.get('/v1/:id/info', async (req, res) => {
//     try {

//         console.log("req.params:", req.params);
//         const id = Number(req.params.id);

//         console.log('Id: ', id);

//         const room = await db.one(
//             `
//                 SELECT
//                     r.*,
//                     COALESCE(inc.inclusions, '[]') AS inclusions,
//                     COALESCE(img.images, '[]') AS images
//                 FROM rooms r

//                 LEFT JOIN (
//                     SELECT
//                         ri.room_id,
//                         json_agg(
//                             DISTINCT jsonb_build_object(
//                                 'id', i.id,
//                                 'inclusion', i.inclusion
//                             )
//                         ) AS inclusions
//                     FROM room_inclusions ri
//                     JOIN inclusions i ON i.id = ri.inclusion_id
//                     GROUP BY ri.room_id
//                 ) inc ON inc.room_id = r.id

//                 LEFT JOIN (
//                     SELECT
//                         room_id,
//                         json_agg(
//                             jsonb_build_object(
//                                 'id', id,
//                                 'image', image_url
//                             )
//                             ORDER BY sort_order
//                         ) AS images
//                     FROM room_images
//                     GROUP BY room_id
//                 ) img ON img.room_id = r.id

//                 WHERE r.id = $1;
//             `, [id]
//         );

//         return res.status(200).json(room)

//     } catch (err) {
//         console.error('Error retrieving room data: ', err);
//         return res.status(500).json({ message: 'Internal server error' })
//     }
// });


roomRoute.get('/v1/:id/info', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const room = await db.one(
            `
                SELECT
                    r.*,
                    bc.upper_deck_total,
                    bc.lower_deck_total,
                    bc.upper_deck_available,
                    bc.lower_deck_available,
                    COALESCE(inc.inclusions, '[]') AS inclusions,
                    COALESCE(img.images, '[]') AS images

                FROM rooms r

                LEFT JOIN bedspace_configs bc
                    ON bc.room_id = r.id

                LEFT JOIN (
                    SELECT
                        ri.room_id,
                        json_agg(
                            DISTINCT jsonb_build_object(
                                'id', i.id,
                                'inclusion', i.inclusion
                            )
                        ) AS inclusions
                    FROM room_inclusions ri
                    JOIN inclusions i ON i.id = ri.inclusion_id
                    GROUP BY ri.room_id
                ) inc ON inc.room_id = r.id

                LEFT JOIN (
                    SELECT
                        room_id,
                        json_agg(
                            jsonb_build_object(
                                'id', id,
                                'image', image_url
                            )
                            ORDER BY sort_order
                        ) AS images
                    FROM room_images
                    GROUP BY room_id
                ) img ON img.room_id = r.id

                WHERE r.id = $1;
            `,
            [id]
        );

        return res.status(200).json(room);

    } catch (err) {
        console.error('Error retrieving room data:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});




roomRoute.get('/v1/preview/details', async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 16, 1), 50);
        const offset = (page - 1) * pageSize;

        const roomType = req.query.type;
        const branchId = req.query.branch ? Number(req.query.branch) : null;
        const minBudget = req.query.minimumBudget ? Number(req.query.minimumBudget) : null;
        const maxBudget = req.query.maximumBudget ? Number(req.query.maximumBudget) : null;

        const inclusions = Array.isArray(req.query.inclusion)
            ? req.query.inclusion
            : req.query.inclusion
                ? [req.query.inclusion]
                : [];

        // Dynamic query building
        let whereConditions = [];
        let params = [];
        let paramIndex = 1;

        
        // Room Type filter
        if (roomType) {
            whereConditions.push(`r.type = $${paramIndex++}`);
            params.push(roomType);
        }

        // Branch filter
        if (branchId) {
            whereConditions.push(`r.branch_id = $${paramIndex++}`);
            params.push(branchId);
        }

        // Price range filter
        if (minBudget !== null) {
            whereConditions.push(`r.price >= $${paramIndex++}`);
            params.push(minBudget);
        }
        if (maxBudget !== null) {
            whereConditions.push(`r.price <= $${paramIndex++}`);
            params.push(maxBudget);
        }

        // if (inclusions.length > 0) {
        //     whereConditions.push(`
        //         EXISTS (
        //             SELECT 1
        //             FROM room_inclusions ri_inc2
        //             JOIN inclusions i2 ON i2.id = ri_inc2.inclusion_id
        //             WHERE ri_inc2.room_id = r.id
        //             AND i2.slug = ANY($${paramIndex++})
        //         )
        //     `);

        //     params.push(inclusions);
        // }

        if (inclusions.length > 0) {
            whereConditions.push(`
                (
                    SELECT COUNT(DISTINCT i2.slug)
                    FROM room_inclusions ri_inc2
                    JOIN inclusions i2 ON i2.id = ri_inc2.inclusion_id
                    WHERE ri_inc2.room_id = r.id
                    AND i2.slug = ANY($${paramIndex})
                ) = $${paramIndex + 1}
            `);

            params.push(inclusions);
            params.push(inclusions.length);
            paramIndex += 2;
        }

        whereConditions.push(`r.slot > 0`);;
        const whereClause = whereConditions.length > 0 
            ? 'WHERE ' + whereConditions.join(' AND ') 
            : '';

        const query = `
            SELECT
                r.id, 
                r.room_uuid,
                r.title,
                r.description,
                r.price,
                r.type,
                r.slot,
                r.gender,
                r.branch_id,
                r.created_at,
                br.name AS branch_name,
                ri.image_url AS thumbnail,
                COALESCE(
                    JSON_AGG(
                        DISTINCT JSONB_BUILD_OBJECT(
                            'id', i.id,
                            'inclusion', i.inclusion
                        )
                    ) FILTER (WHERE i.id IS NOT NULL),
                    '[]'
                ) AS inclusions
            FROM rooms r
            JOIN branches br ON br.id = r.branch_id

            LEFT JOIN (
                SELECT DISTINCT ON (room_id)
                    room_id,
                    image_url
                FROM room_images
                ORDER BY room_id, id ASC
            ) ri ON ri.room_id = r.id

            LEFT JOIN room_inclusions ri_inc ON ri_inc.room_id = r.id
            LEFT JOIN inclusions i ON i.id = ri_inc.inclusion_id

            ${whereClause}

            GROUP BY 
                r.id, r.room_uuid, r.title, r.description, r.price, 
                r.type, r.gender, r.branch_id, r.created_at, br.name, ri.image_url

            ORDER BY r.created_at DESC
            LIMIT $${paramIndex++}
            OFFSET $${paramIndex++}
        `;

        params.push(pageSize, offset);

        const rooms = await db.manyOrNone(query, params);

        const totalRooms = await db.one(
            `
            SELECT COUNT(DISTINCT r.id)
            FROM rooms r
            LEFT JOIN room_inclusions ri_inc ON ri_inc.room_id = r.id
            LEFT JOIN inclusions i ON i.id = ri_inc.inclusion_id
            ${whereClause}
            `,
            params
        );

        return res.status(200).json({
            success: true,
            message: rooms.length > 0 ? "Rooms retrieved successfully" : "No rooms found",
            data: rooms,
            pagination: {
                page,
                pageSize,
                totalRecords: Math.ceil(Number(totalRooms.count))  ,
                totalPage: Math.ceil(Number(totalRooms.count) / 16) 
            }
        });

    } catch (err) {
        console.error('Error retrieving room data: ', err);
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
});


roomRoute.get('/v1/preview/:id/details', async (req, res) => {
    try {

        const id = Number(req.params.id);

        if (isNaN(id)) {
            throw new Error('Id must be a number')
        };

        if (!id) {
            throw new Error('Id is required')
        };

        const details = await db.oneOrNone(
            `
                SELECT
                    r.*,
                    jsonb_build_object(
                        'id', b.id,
                        'name', b.name,
                        'address', b.address,
                        'branch_image', b.branch_image,
                        'landmarks', COALESCE(lm.landmarks, '[]')
                    ) AS branch,

                    jsonb_build_object(
                        'id', u.id,
                        'fullname', u.fullname,
                        'contact_number', u.contact_number,
                        'email', u.email
                    ) AS property_manager,

                    COALESCE(inc.inclusions, '[]') AS inclusions,
                    COALESCE(img.images, '[]') AS images

                FROM rooms r

                JOIN branches b
                    ON b.id = r.branch_id

                LEFT JOIN users u
                    ON u.id = b.property_manager_id
                    AND u.is_active = true

                LEFT JOIN (
                    SELECT
                        ri.room_id,
                        json_agg(
                            DISTINCT jsonb_build_object(
                                'id', i.id,
                                'inclusion', i.inclusion,
                                'slug', i.slug
                            )
                        ) AS inclusions
                    FROM room_inclusions ri
                    JOIN inclusions i
                        ON i.id = ri.inclusion_id
                    GROUP BY ri.room_id
                ) inc
                    ON inc.room_id = r.id

                LEFT JOIN (
                    SELECT
                        room_id,
                        json_agg(
                            jsonb_build_object(
                                'id', id,
                                'image', image_url
                            )
                            ORDER BY sort_order
                        ) AS images
                    FROM room_images
                    GROUP BY room_id
                ) img
                    ON img.room_id = r.id

                LEFT JOIN (
                    SELECT
                        bl.branch_id,
                        json_agg(
                            DISTINCT jsonb_build_object(
                                'id', l.id,
                                'landmark', l.landmark
                            )
                        ) AS landmarks
                    FROM branch_landmarks bl
                    JOIN landmarks l
                        ON l.id = bl.landmark_id
                    GROUP BY bl.branch_id
                ) lm
                    ON lm.branch_id = b.id

                WHERE r.id = $1;
            `, [id]
        );

        if (!details) {
            return res.status(400).json({
                message: 'Room not found'
            });
        }

        return res.status(200).json(details);

    } catch (err) {
        console.error('Error retrieving room details: ', err);
    }
});



export default roomRoute;