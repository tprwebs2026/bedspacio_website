import express from 'express';
import axios from 'axios'
import { db } from '../config/database.js';
import { inquiryLimiter } from '../middleware/rateLimit.js';
import { requireAuth } from '../middleware/auth.js';

import resend from '../service/resend.js';
import { customAlphabet } from 'nanoid';

const inquiryRoutes = express.Router();


/*
    1. Whenever a user submits a form inquiry from /rentals page,
    the data from the form will be created to the inquiries table on the database.
    2. GoHighLevel is also storing the inquiry data from the form using webhook that calls this POST endpoint.
    3. Two records are made, one from database and one for GoHighLevel

*/

inquiryRoutes.post('/v1/room-inquiry', inquiryLimiter, async (req, res) => {
    try {
        const {
            room_uuid,
            starting_price,
            fullname,
            email,
            contact_number,
            work_schedule,
            target_move_in,
            months_of_stay,
            message,
            type = 'room_inquiry'
        } = req.body;

        const ip_address = req.ip;

        const nanoid = customAlphabet(
            'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
            8
        );

        const reference_number = `INQ-${nanoid()}`;
        
        const roomName = await db.one( 
            `SELECT title FROM rooms WHERE room_uuid = $1`,
            [ room_uuid ]
        )

        // STEP 1: Insert inquiry
        const inquiry = await db.one(
            `
            INSERT INTO inquiries (
                room_uuid,
                starting_price,
                fullname,
                email,
                contact_number,
                subject,
                work_schedule,
                target_move_in,
                months_of_stay,
                message,
                ip_address,
                type, 
                reference_number
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
            )
            RETURNING id, created_at
            `,
            [
                room_uuid,
                starting_price,
                fullname,
                email,
                contact_number,
                `Room Inquiry - ${fullname}-${room_uuid}`,
                work_schedule,
                target_move_in,
                months_of_stay,
                message,
                ip_address,
                type,
                reference_number
            ]
        );

        try {
            await resend.emails.send({
                from: process.env.EMAIL_FROM,
                to: email,
                subject: `ROOM INQUIRY RECEIVED`,
                html:`
                    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                        <h2>Thank you, ${fullname}!</h2>

                        <p>We have successfully received your room inquiry.</p>

                        <p><strong>Reference Number:</strong> ${reference_number}</p>
                        <p><strong>Room ID:</strong> ${room_uuid}</p>
                        <p><strong>Room:</strong> ${roomName.title}</p>
                        <p><strong>Target Move-In date:</strong> ${target_move_in}</p>
                        <p><strong>Months of Stay:</strong> ${months_of_stay}</p>

                        <p>Please keep your Reference Number for future communication regarding this inquiry.</p>
                        <p>Our property manager will contact you through your mobile number or email address to discuss room availability and the next steps.</p>

                        <p>If you have any questions or need to update your inquiry details, please reply to this email and include your Reference Number.</p>

                        <hr />

                        <p>Thank you for choosing BedSpacio.</p>

                        <p>Best regards,</p>
                        <p>BedSpacio Team</p>
                    </div>
                `
            }).catch(console.error);
        } catch (err) {
            console.error("Email sending failed:", emailError);
        }

        return res.status(200).json({
            success: true,
            inquiry_id: inquiry.id,
            reference_number: inquiry.reference_number,
        });
    } catch (err) {
        console.error('Error creating inquiry:', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});


/*
    1. Used to store the inquiry form submission to database only
    2. Fallback POST request if GoHighLevel is not integrated
*/
inquiryRoutes.post('/v2/room-inquiry', inquiryLimiter, async (req, res) => {
    try {
        const {
            room_uuid,
            room_name,
            starting_price,
            fullname,
            email,
            contact_number,
            work_schedule,
            target_move_in,
            months_of_stay,
            message,
            type = 'room_inquiry'
        } = req.body;

        const ip_address = req.ip;

        const nanoid = customAlphabet(
            'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
            8
        );

        const reference_number = `INQ-${nanoid()}`;


        // STEP 1: Insert inquiry
        const inquiry = await db.one(
            `
            INSERT INTO inquiries (
                room_uuid,
                room_name,
                starting_price,
                fullname,
                email,
                contact_number,
                subject,
                work_schedule,
                target_move_in,
                months_of_stay,
                message,
                ip_address,
                type, 
                reference_number
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
            )
            RETURNING id, created_at, reference_number
            `,
            [
                room_uuid,
                room_name,
                starting_price,
                fullname,
                email,
                contact_number,
                `Room Inquiry - ${fullname}-${room_uuid}`,
                work_schedule,
                target_move_in,
                months_of_stay,
                message,
                ip_address,
                type,
                reference_number
            ]
        );

        console.log({
            inquiry_id: inquiry.id,
            reference_number: inquiry.reference_number
        })

        return res.status(200).json({
            success: true,
            inquiry_id: inquiry.id,
            reference_number: inquiry.reference_number,
        });


    } catch (err) {
        console.error('Error creating inquiry:', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});


// Fallback POST request for manually creating inquiry inside inquiries page in ADMIN
// Will be used if GoHighLevel is not Integrated to the system


inquiryRoutes.post('/v2/room-inquiry/manual', inquiryLimiter, async (req, res) => {
    try {

        const {
            fullname,
            contact_number,
            email,
            work_schedule,
            target_move_in,
            months_of_stay,
            room_uuid,
            note
        } = req.body;

        const ip_address = req.ip;

        // Generate your inquiry reference number locally using nanoid
        
        const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 10);
        const referenceNumber = `INQ-${nanoid(10).toUpperCase()}`;

        const room = await db.oneOrNone(
            `SELECT price FROM rooms WHERE room_uuid = $1`,
            [room_uuid]
        )

        if (!room) {
            return res.status(400).json({
                success: false,
                message: 'Room not found'
            })
        }
    

        const record = await db.oneOrNone(
            `
            INSERT INTO inquiries (
                type, 
                fullname,
                contact_number,
                email,
                work_schedule,
                target_move_in,
                months_of_stay,
                room_uuid,
                message,
                reference_number,
                ip_address
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
            ) RETURNING *
            `, [
                'room_inquiry',
                fullname, 
                contact_number,
                email,
                work_schedule,
                target_move_in,
                months_of_stay,
                room_uuid,
                note,
                referenceNumber,
                ip_address
            ]
        );

        // Response back to your Next.js frontend
        return res.status(200).json({
            success: true,
            message: 'Inquiry successfully processed and added to GHL New Lead stage.',
            referenceNumber: referenceNumber,
            data: record
        });

        

    } catch (err) {
        console.log('Error creating new inquiry record in admin: ', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})




/*
    Reason for commenting ('/inquiry/v1'): 
    This is used on the version where GHL or any other third party CRM is used.
    This holds on to the status used on the inquiries table on the database (postgres)
    - If GHL is used, no need to qury for status, instead use ghl_status 
*/
inquiryRoutes.get('/v1', async (req, res) => {
    try {
        const ghl_status = req.query.ghl_status;
        const search = req.query.search; 

        const page = parseInt(req.query.page) || 1;
        const limit = 25;
        const offset = (page - 1) * limit;


        // MAIN QUERY (paginated)
        const result = await db.manyOrNone(
            `
            SELECT 
                id,
                type,
                reference_number,
                fullname,
                contact_number,
                room_uuid,
                ghl_status,
                ghl_pipeline_stage,
                created_at
            FROM inquiries
            WHERE 
                is_archived = false

                AND ($1::text IS NULL OR ghl_status = $1)

                AND (
                    $2::text IS NULL OR
                    reference_number ILIKE '%' || $2 || '%' OR
                    fullname ILIKE '%' || $2 || '%' OR
                    contact_number ILIKE '%' || $2 || '%' OR
                    room_uuid ILIKE '%' || $2 || '%'
                )

            ORDER BY id DESC
            LIMIT $3 OFFSET $4
            `,
            [
                ghl_status || null,
                search || null,
                limit,
                offset
            ]
        );

        // COUNT QUERY
        const countResult = await db.one(
            `
            SELECT COUNT(*)::int AS total
            FROM inquiries
            WHERE 
                is_archived = false

                AND ($1::text IS NULL OR ghl_status = $1)

                AND (
                    $2::text IS NULL OR
                    reference_number ILIKE '%' || $2 || '%' OR
                    fullname ILIKE '%' || $2 || '%' OR
                    contact_number ILIKE '%' || $2 || '%' OR
                    room_uuid ILIKE '%' || $2 || '%'
                )
            `,
            [
                ghl_status || null,
                search || null
            ]
        );

        const totalPages = Math.ceil(countResult.total / limit);

        return res.status(200).json({
            data: result,
            pagination: {
                page,
                limit,
                total: countResult.total,
                totalPages
            }
        });

    } catch (err) {
        console.error('Error retrieving inquiries:', err);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});



/*
    1. Used as fallback if GoHighLevel is not integrated
*/
inquiryRoutes.get('/v2/fallback', async (req, res) => {
    try {
        const inq_status = req.query.inq_status;
        const search = req.query.search; 

        const page = parseInt(req.query.page) || 1;
        const limit = 25;
        const offset = (page - 1) * limit;


        // MAIN QUERY (paginated)
        const result = await db.manyOrNone(
            `
            SELECT 
                id,
                type,
                reference_number,
                fullname,
                contact_number,
                room_uuid,
                inq_status,
                created_at
            FROM inquiries
            WHERE 
                is_archived = false

                AND ($1::text IS NULL OR inq_status = $1)

                AND (
                    $2::text IS NULL OR
                    reference_number ILIKE '%' || $2 || '%' OR
                    fullname ILIKE '%' || $2 || '%' OR
                    contact_number ILIKE '%' || $2 || '%' OR
                    room_uuid ILIKE '%' || $2 || '%'
                )

            ORDER BY id DESC
            LIMIT $3 OFFSET $4
            `,
            [
                inq_status || null,
                search || null,
                limit,
                offset
            ]
        );

        // COUNT QUERY
        const countResult = await db.one(
            `
            SELECT COUNT(*)::int AS total
            FROM inquiries
            WHERE 
                is_archived = false

                AND ($1::text IS NULL OR inq_status = $1)

                AND (
                    $2::text IS NULL OR
                    reference_number ILIKE '%' || $2 || '%' OR
                    fullname ILIKE '%' || $2 || '%' OR
                    contact_number ILIKE '%' || $2 || '%' OR
                    room_uuid ILIKE '%' || $2 || '%'
                )
            `,
            [
                inq_status || null,
                search || null
            ]
        );

        const totalPages = Math.ceil(countResult.total / limit);

        return res.status(200).json({
            data: result,
            pagination: {
                page,
                limit,
                total: countResult.total,
                totalPages
            }
        });

    } catch (err) {
        console.error('Error retrieving inquiries:', err);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});



/*
    1. Get the version using the date from updated_at field on the inquiries table
    2. Used to check if the table have any changes coming from the updates on stages/status/fields from the leads/opportunity from GoHighLevel
*/
inquiryRoutes.get("/v1/version", async (req, res) => {
    try {
        const result = await db.one(`
            SELECT MAX(updated_at) AS version
            FROM inquiries
        `);

        return res.status(200).json({
            version: result.version,
        });
        
    } catch (err) {
        console.error("Error fetching inquiry version:", err);

        return res.status(500).json({
            message: "Failed to fetch version",
        });
    }
});



/*
    > Getting all the room_uuid of all available rooms
    > Used for manually creating room inquiry on admin page (Inquiry)
*/
inquiryRoutes.get('/v1/room_uuid', async (req, res) => {
    try {
        const rooms = await db.manyOrNone(
            `SELECT room_uuid, type FROM rooms WHERE slot > 0`
        );

        return res.status(200).json(rooms);

    } catch (err) {
        console.log('Error fetching room_uuid: ', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
})



inquiryRoutes.get('/v1/details/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if(isNaN(id)) {
            throw new Error('Id must be a number');
        }

        const result = await db.oneOrNone(
            `SELECT 
                i.*,
                TO_CHAR(
                    i.target_move_in AT TIME ZONE 'Asia/Manila',
                    'YYYY-MM-DD'
                ) AS target_move_in,
                rm.id as room_id,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', il.id,
                            'note', il.note,
                            'noter', u.fullname,
                            'noted_at', TO_CHAR(
                                il.created_at,
                                'YYYY-MM-DD "at" FMHH12:MI am'
                            )
                        )
                        ORDER BY il.created_at ASC
                    ) FILTER (WHERE il.id IS NOT NULL),
                    '[]'
                ) AS inquiry_logs

            FROM inquiries i
            LEFT JOIN rooms rm ON rm.room_uuid = i.room_uuid
            LEFT JOIN inquiry_logs il ON il.inquiry_id = i.id
            LEFT JOIN users u ON u.id = il.created_by
            WHERE i.id = $1
            GROUP BY i.id, rm.id`,
            [id]
        );

        return res.status(200).json(result);

    } catch (err) {
        console.error('Error retrieving inquiry: ', err);

        return res.status(500).json({
            message: 'Internal server error'
        })
    }
});


/*
    Reason for commenting ('/inquiry/v1/status/:id'): 
    > with GHL integration, updating the status on the inquiry page manually is not an option anymore
    > The purpose of the inquiry page is to display the inquiry information and handle all updates on the GHL directly


    !!!! UNCOMMENTING TEMPORARILY TO CREATE FALLBACKS - 6/8/2026

    No need to use if GHL is integrated - 06-15-2026
*/


inquiryRoutes.patch('/v1/:id/fields', requireAuth, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const {
            room_uuid,
            target_move_in,
            months_of_stay
        } = req.body;

        const updates = [];
        const values = [];
        
        if (room_uuid ) {
            updates.push(`room_uuid = $${values.length + 1}`);
            values.push(room_uuid);
        }

        if (target_move_in ) {
            updates.push(`target_move_in = $${values.length + 1}`);
            values.push(target_move_in);
        }

        if (months_of_stay ) {
            updates.push(`months_of_stay = $${values.length + 1}`);
            values.push(months_of_stay);
        }

        values.push(Number(id));

        await db.none(
            `UPDATE inquiries
            SET ${updates.join(', ')}
            WHERE id = $${values.length}`,
            values
        );

        return res.status(200).json({
            success: true
        })

    } catch (err) {
        console.log('Error updating inquiry: ', err);

        return res.status(500).json({
            success: false
        })
    }
})



/*
    No need to use if GHL is integrated
    - 06-15-2026
*/
inquiryRoutes.patch('/v1/status/:id', requireAuth, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { inq_status } = req.body;
        const update = await db.oneOrNone(
            `UPDATE inquiries 
            SET 
                inq_status = $1,
                updated_at = NOW()
            WHERE id = $2 
            RETURNING updated_at`,
            [inq_status, id]
        );

        console.log('Update result:', update);
        
        if (!update) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        const note = `Status updated to ${inq_status}.`

        const newLog = await db.one(
    `
            INSERT INTO inquiry_logs 
            (
                inquiry_id,
                note
            )
            VALUES
            ( $1, $2 )
            RETURNING
                id,
                note,
                created_at
            `,
            [id, note]
        );

        return res.status(200).json({ 
            success: true, 
            message: 'Update successful',
            log: {
                id: newLog.id,
                note: newLog.note,
                noted_at: newLog.created_at,
                noter: req.user?.fullname || fullname
            }
        })
        
    } catch (err) {
        console.error(err);
        console.error('Error message:', err.message);
        console.error('Error detail:', err.detail);
        console.error('Error stack:', err.stack);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
});


/* 
    USE THIS AS FALLBACK IF GHL is not INTEGRATED
    ---- 06-08-2026

    No need to use if GHL is integrated
    - 06-15-2026
*/

inquiryRoutes.patch('/v2/status/:id/fallback', requireAuth, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { inq_status } = req.body;
        const update = await db.oneOrNone(
            `UPDATE inquiries 
            SET 
                inq_status = $1,
                updated_at = NOW()
            WHERE id = $2 
            RETURNING updated_at`,
            [inq_status, id]
        );

        console.log('Update result:', update);
        
        if (!update) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        const note = `Status updated to ${inq_status}.`

        const newLog = await db.one(
    `
            INSERT INTO inquiry_logs 
            (
                inquiry_id,
                note
            )
            VALUES
            ( $1, $2 )
            RETURNING
                id,
                note,
                created_at
            `,
            [id, note]
        );

        return res.status(200).json({ 
            success: true, 
            message: 'Update successful',
            log: {
                id: newLog.id,
                note: newLog.note,
                noted_at: newLog.created_at,
                noter: req.user?.fullname || fullname
            }
        })
        
    } catch (err) {
        console.error(err);
        console.error('Error message:', err.message);
        console.error('Error detail:', err.detail);
        console.error('Error stack:', err.stack);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
});






/*
    No need to use if GHL is integrated
    - 06-15-2026
*/ 
inquiryRoutes.delete('/v1/multiple', requireAuth, async (req, res) => {
    try {
        const ids = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Ids must be a non-empty array'
            });
        }

        const inquiries = await db.any(
            `SELECT id, inq_status FROM inquiries WHERE id = ANY($1::int[])`,
            [ids]
        );

        const foundIds = inquiries.map(i => i.id);

        const notFound = ids
            .filter(id => !foundIds.includes(id))
            .map(id => ({
                id,
                message: 'Inquiry not found'
            }));

        const deletable = inquiries
            .filter(i => i.inq_status === 'Closed - Lost')
            .map(i => i.id);

        const notClosed = inquiries
            .filter(i => i.inq_status !== 'Closed - Lost')
            .map(i => ({
                id: i.id,
                status: i.inq_status,
                message: 'Only closed inquiries can be deleted'
            }));

        if (deletable.length > 0) {
            await db.none(
                `DELETE FROM inquiries WHERE id = ANY($1::int[])`,
                [deletable]
            );
        }


        return res.status(200).json({
            success: true,
            summary: {
                requested: ids.length,
                deleted: deletable.length,
                not_closed: notClosed.length,
                not_found: notFound.length
            },
            deleted: deletable,
            not_closed: notClosed,
            not_found: notFound
        });

    } catch (err) {
        console.error('Error deleting inquiries: ', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});



/*
    No need to use if GHL is integrated
    - 06-15-2026
*/ 
inquiryRoutes.delete('/v1/archive/multiple', requireAuth, async (req, res) => {
    try {
        const { ids } = req.body;

        console.log('ids to delete on archives? : ', ids);

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Ids must be a non-empty array'
            });
        }

        const archives = await db.any(
            `SELECT id, inq_status FROM inquiries WHERE id = ANY($1::int[]) AND is_archived = true`,
            [ids]
        );

        const foundIds = archives.map(i => i.id);

        if (foundIds.length > 0) {
            await db.none(
                `DELETE FROM inquiries WHERE id = ANY($1::int[]) AND is_archived = true`,
                [foundIds]
            );
        }

        return res.status(200).json({
            success: true,
            archived: foundIds
        });

    } catch (err) {
        console.error('Error deleting inquiries: ', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});



/*
    No need to use if GHL is integrated
    - 06-15-2026
*/ 
inquiryRoutes.patch('/v1/archive/multiple', requireAuth, async (req, res) => {
    try {
        const { ids } = req.body;

        console.log('ids? : ', ids);

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Ids must be a non-empty array'
            });
        }

        const archives = await db.any(
            `SELECT id, inq_status FROM inquiries WHERE id = ANY($1::int[]) AND is_archived = false`,
            [ids]
        );

        const foundIds = archives.map(i => i.id);

        if (foundIds.length > 0) {
            await db.none(
                `UPDATE inquiries SET is_archived = true WHERE id = ANY($1::int[])`,
                [foundIds]
            );
        }

        return res.status(200).json({
            success: true,
            archived: foundIds
        });

    } catch (err) {
        console.error('Error deleting inquiries: ', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});


/*
    No need to use if GHL is integrated
    - 06-15-2026
*/ 
inquiryRoutes.patch('/v1/unarchive/multiple', requireAuth, async (req, res) => {
    try {
        const { ids } = req.body;

        console.log('ids? : ', ids);

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Ids must be a non-empty array'
            });
        }

        const archives = await db.any(
            `SELECT id, inq_status FROM inquiries WHERE id = ANY($1::int[]) AND is_archived = true`,
            [ids]
        );

        const foundIds = archives.map(i => i.id);

        if (foundIds.length > 0) {
            await db.none(
                `UPDATE inquiries SET is_archived = false WHERE id = ANY($1::int[])`,
                [foundIds]
            );
        }

        return res.status(200).json({
            success: true,
            archived: foundIds
        });

    } catch (err) {
        console.error('Error deleting inquiries: ', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});



/*
    No need to use if GHL is integrated
    - 06-15-2026
*/ 
inquiryRoutes.delete('/v1/archived/:id', requireAuth, async (req, res) => {
    try {

        const id = Number(req.params.id);

        if (isNaN(id)) {
            throw new Error('Id must be a number')
        };

        const inquiry = await db.oneOrNone(
            `SELECT * FROM inquiries WHERE id = $1`,
            [id]
        );

        if (!inquiry) {
            return res.status(404).json({
                success:false,
                message: 'Inquiry not found'
            });
        }

        await db.none(
            `DELETE FROM inquiries WHERE id = $1`,
            [id]
        )

        return res.status(200).json({
            success: true,
            message: 'Inquiry deleted successfully'
        })

    } catch (err) {
        console.error('Error deleting inquiry: ', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
})



// Delete single inqiury
/*
    No need to use if GHL is integrated
    - 06-15-2026
*/
inquiryRoutes.delete('/v1/:id', requireAuth, async (req, res) => {
    try {

        const id = Number(req.params.id);

        if (isNaN(id)) {
            throw new Error('Id must be a number')
        };

        const inquiry = await db.oneOrNone(
            `SELECT * FROM inquiries WHERE id = $1`,
            [id]
        );

        if (!inquiry) {
            return res.status(404).json({
                success:false,
                message: 'Inquiry not found'
            });
        }

        if (inquiry.status !== 'closed' ) {
            return res.status(400).json({
                success: false,
                message: 'Only closed inquiries can be deleted'
            })
        };

        await db.none(
            `DELETE FROM inquiries WHERE id = $1`,
            [id]
        )

        return res.status(200).json({
            success: true,
            message: 'Inquiry deleted successfully'
        })


    } catch (err) {
        console.error('Error deleting inquiry: ', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
})




// adding a note on the inquiry
// each note submits the time and the user who added the note
/*
    No need to use if GHL is integrated
    - 06-15-2026
*/

inquiryRoutes.post('/v1/:id/note', requireAuth, async (req, res) => {
    try {
        
        const id = Number(req.params.id);

        if (isNaN(id)) {
            throw new Error('Id must be a number');
        };

        const check_inquiry = await db.oneOrNone(
            `SELECT * FROM inquiries WHERE id = $1`,
            [id]
        )

        if (!check_inquiry) {
            res.status(404).json({
                success: false,
                message: 'Missing inquiry'
            })
        }

        const {
            note,
            created_by
        } = req.body;

        if (!note.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Note can not be empty'
            })
        }


        if (!note || !created_by) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            })
        }


        const newNote = await db.one(
            `INSERT INTO inquiry_logs ( 
                inquiry_id, note, created_by 
            )
            VALUES ( $1, $2, $3 )
            RETURNING
                note,
                created_by AS noted_by,
                LOWER(
                    TO_CHAR(
                        created_at,
                        'YYYY-MM-DD "at" FMHH12:MI AM'
                    )
                ) AS noted_at
            `,
            [ id, note, created_by ]
        );

        const user = await db.oneOrNone(
            `SELECT fullname FROM users WHERE id = $1`,
            [created_by]
        );
        

        return res.status(200).json({
            success: true,
            message: 'Note added successfully',
            data: {
                ...newNote,
                noter: user?.fullname || 'Unknown User'
            }
        });
        


    } catch (err) {
        console.log('Error adding notes in the inquiry: ', err);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
})



// archive an inquiry 
// all inquiry status can be archive if the user chooses to
// all archived inquiries are moved to another page

// This is to archive a single inquiry
/*
    No need to use if GHL is integrated
    - 06-15-2026
*/ 
inquiryRoutes.patch('/v1/archive/:id', requireAuth, async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid inquiry ID'
            });
        }

        const inquiry = await db.oneOrNone(
            `SELECT * FROM inquiries WHERE id = $1`,
            [id]
        );

        if (!inquiry) {
            return res.status(400).json({
                success: false,
                message: 'Inquiry not found'
            })
        }

        if (inquiry.is_archived) {
            return res.status(400).json({
                success: false,
                message: 'Inquiry is already archived'
            });
        }

        const result = await db.one(
            `UPDATE inquiries 
            SET is_archived = true, updated_at = now()
            WHERE id = $1 
            RETURNING *`,
            [id]
        );


        return res.status(200).json({
            success: true,
            message: 'Inquiry archived successfully',
            data: result
        })


    } catch (err) {
        console.error('Error archiving inquiry: ', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});


/*
    No need to use if GHL is integrated
    - 06-15-2026
*/
// restore inquiry to unarchived (is_archived = false)
inquiryRoutes.patch('/v1/unarchive/:id', requireAuth, async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid inquiry ID'
            });
        }

        const inquiry = await db.oneOrNone(
            `SELECT * FROM inquiries WHERE id = $1`,
            [id]
        );

        if (!inquiry) {
            return res.status(400).json({
                success: false,
                message: 'Inquiry not found'
            })
        }

        if (!inquiry.is_archived) {
            return res.status(400).json({
                success: false,
                message: 'Inquiry is not archived'
            });
        }

        const result = await db.one(
            `UPDATE inquiries 
            SET is_archived = false, updated_at = now()
            WHERE id = $1 
            RETURNING *`,
            [id]
        );


        return res.status(200).json({
            success: true,
            message: 'Inquiry restored successfully',
            data: result
        })


    } catch (err) {
        console.error('Error restoring inquiry: ', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});



// all archived inquiries
/*
    No need to use if GHL is integrated
    - 06-15-2026
*/
inquiryRoutes.get('/v1/archived', async (req, res) => {
    try {

        const result = await db.manyOrNone(
            `SELECT 
                id,
                type,
                reference_number,
                fullname,
                contact_number,
                ghl_status,
                created_at,
                updated_at
            FROM inquiries 
            WHERE is_archived = true
            ORDER BY id ASC`
        )

        return res.status(200).json(result);

    } catch (err) {
        console.error('Error retrieving room inquiries: ', err);
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
});


/*
    USE THIS AS FALLBACK IF GHL IS NOT INTEGRATED
*/
inquiryRoutes.get('/v2/archived/fallback', async (req, res) => {
    try {

        const result = await db.manyOrNone(
            `SELECT 
                id,
                type,
                reference_number,
                fullname,
                contact_number,
                inq_status,
                created_at,
                updated_at
            FROM inquiries 
            WHERE is_archived = true
            ORDER BY id ASC`
        )

        return res.status(200).json(result);

    } catch (err) {
        console.error('Error retrieving room inquiries: ', err);
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
});


// check for the details of an archived inquiry based on ID
/*
    No need to use if GHL is integrated
    - 06-15-2026
*/
inquiryRoutes.get('/v1/details/:id/archived', async (req, res) => {
    try {
        const id = req.params.id;

        if(isNaN(id)) {
            throw new Error('Id must be a number');
        }

        const result = await db.oneOrNone(
            `SELECT 
                i.*,
                rm.id as room_id,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', il.id,
                            'note', il.note,
                            'noter', u.fullname,
                            'noted_at', TO_CHAR(
                                il.created_at,
                                'YYYY-MM-DD "at" FMHH12:MI am'
                            )
                        )
                        ORDER BY il.created_at ASC
                    ) FILTER (WHERE il.id IS NOT NULL),
                    '[]'
                ) AS inquiry_logs

            FROM inquiries i
            LEFT JOIN rooms rm ON rm.room_uuid = i.room_uuid
            LEFT JOIN inquiry_logs il ON il.inquiry_id = i.id
            LEFT JOIN users u ON u.id = il.created_by
            WHERE i.id = $1 AND i.is_archived = true
            GROUP BY i.id, rm.id`,
            [id]
        );

        return res.status(200).json(result);

    } catch (err) {
        console.error('Error retrieving inquiry: ', err);

        return res.status(500).json({
            message: 'Internal server error'
        })
    }
});


export default inquiryRoutes;