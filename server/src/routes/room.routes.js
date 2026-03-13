import express from 'express';
import { searchRead, readByIds, executeKw } from '../odoo/odoo.service.js';

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
        if (!isNaN(branchFilter)) domain.push(["branch_id", "=", branchFilter]); // get the id to filter branch
        if (!isNaN(minBudget)) domain.push(["starting_price", ">=", minBudget]);
        if (!isNaN(maxBudget)) domain.push(["starting_price", "<=", maxBudget]);


        console.log("Room type filter:", roomType);

        // filter the data with inclusions
        if (inclusionfilter) {
            const inclusionId = (Array.isArray(inclusionfilter) ? inclusionfilter : [inclusionfilter])
                .map(Number)
                .filter(Number.isFinite);

            console.log("Filtered inclusion ID: ", inclusionId);
            domain.push(["inclusion_ids", "in", inclusionId]); // get the id to filter inclusion
        }

        const totalItems = await executeKw({
            model: "bedspacio.room",
            method: "search_count",
            args: [domain]
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
                fields: ["name"]
            })
            : [];

        const inclusionMap = Object.fromEntries(inclusions.map(inc => [inc.id, inc]));

        const imageIds = [...new Set(
            rooms
                .flatMap(room => room.image_ids?.[0]) // take the first image [index 0]
                .filter((id) => typeof id === "number")
            )];
        const thumbs = imageIds.length
            ? await readByIds({
                model: "bedspacio.room.image",
                ids: imageIds,
                fields: ["image"]
            })
            : [];
        
        const thumbMap = Object.fromEntries(thumbs.map(thumb => [thumb.id, thumb]))

        const items = rooms.map((room) => {
            const thumbId = room.image_ids?.[0];
            const thumbRecord = typeof thumbId === "number" ? thumbMap[thumbId] : null;

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

                thumbnail: thumbRecord?.image ?? null,
                thumbnail_image_id: thumbId ?? null
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
                "room_name",
                "room_type",
                "description",
                "gender",
                "starting_price",
                "maximum_pax",
                "available_slot",
                "available_upper",
                "available_lower",
                "branch_id",
                "property_manager_name",
                "property_contact",
                "profile_image",
                "inclusion_ids",
                "payment_term_ids"
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
                fields: [ "name" ]
            }) : []


        // GET THE FIELDS ID, LABEL, AMOUNT FOR PAYMENT TERMS
        // Map the ids for payment_term_ids
        const paymentTerms = data.payment_term_ids.length
            ? await readByIds({
                model: "bedspacio.payment.term",
                ids: data.payment_term_ids,
                fields: [ "label", "amount" ] 
            }) : []


        res.json({
                id:room_id,
                name: data.room_name,
                type: data.room_type,
                description: data.description,
                gender: data.gender,
                starting_price: data.starting_price,
                maximum_pax: data.maximum_pax,
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
                property_manager: data.property_manager_name,
                property_manager_contact: data.property_contact,
                profile_image: data.profile_image,
                inclusions: inclusions,
                payment_terms: paymentTerms
            });

    } catch (err) {
        console.error("Room detail error: ", err);

        return res.status(500).json({
            sucess: false,
            message: 'Error retrieving room detail'
        });
    }
})



roomRoute.get('/v1/:id/images', async (req, res, next ) => {
    try {
        const room_id = Number(req.params.id);
        
        const roomImages = await searchRead({
            model: "bedspacio.room",
            domain: [["id", "=", room_id]],
            fields: [ "image_ids" ],
            limit: 1,
            offset: Number(req.query.offset || 0),
            order: "id asc"
        });

        const data = roomImages[0];


        const images = data.image_ids.length
            ? await readByIds({
                model: "bedspacio.room.image",
                ids: data.image_ids,
                fields: [
                    "image",
                    "image_order"
                ]
            }) : [] 

        res.json({
            id: room_id,
            image: images
        });

    } catch (err) {
        next(err);
    }
})



// TODO: 
// Create a filter to retrieve all room listing that includes the selected inclusion id
roomRoute.get('/v1/filter', async (req, res, next) => {
    try {

        
    } catch (err) {
        console.error('[Room filtering] Failed to do whatever the fuck this needs to do: ', err);
        next(err);
    }
});



export default roomRoute;