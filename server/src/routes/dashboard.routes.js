import express from 'express';
import { db } from '../config/database.js';
import { rateLimitMiddleware, inquiryLimiter } from '../middleware/rateLimit.js';
import { requireAuth } from '../middleware/auth.js';


const dashboardRoute = express.Router();

/*
 *  reason for commenting '/v1/inquiry/pending'
 *  > integration of GoHighLevel
 *  > status field on inquiries table in postgres will be replaced 
 *  by ghl_status from GoHighLevel
 */

// dashboardRoute.get('/v1/inquiry/pending', async (req, res) => {
//     try {

//         const result = await db.manyOrNone(
//             `SELECT 
//                 id,
//                 room_uuid,
//                 fullname,
//                 status,
//                 target_move_in,
//                 created_at
//             FROM inquiries 
//             WHERE 
//                 is_archived = false AND
//                 status = 'pending' AND
//                 type = 'room_inquiry'
//             ORDER BY created_at ASC
//             LIMIT 8 OFFSET 0
//             `
//         )

//         return res.status(200).json(result);

//     } catch (err) {
//         console.error('Error retrieving room inquiries: ', err);
//         return res.status(500).json({
//             message: 'Internal server error'
//         })
//     }
// });



// dashboardRoute.get('/v1/inquiry/pending', async (req, res) => {
//     try {

//         const result = await db.manyOrNone(
//             `SELECT 
//                 id,
//                 room_uuid,
//                 fullname,
//                 ghl_status,
//                 target_move_in,
//                 created_at
//             FROM inquiries 
//             WHERE 
//                 is_archived = false AND
//                 ghl_status = 'open' AND
//                 type = 'room_inquiry'
//             ORDER BY created_at ASC
//             LIMIT 8 OFFSET 0
//             `
//         )

//         return res.status(200).json(result);

//     } catch (err) {
//         console.error('Error retrieving room inquiries: ', err);
//         return res.status(500).json({
//             message: 'Internal server error'
//         })
//     }
// });

dashboardRoute.get('/v1/inquiry/new-leads', async (req, res) => {
    try {

        const result = await db.manyOrNone(
            `SELECT 
                id,
                room_uuid,
                fullname,
                ghl_status,
                ghl_pipeline_stage,
                target_move_in,
                created_at
            FROM inquiries 
            WHERE 
                is_archived = false AND
                ghl_pipeline_stage = 'New Lead' AND
                type = 'room_inquiry'
            ORDER BY created_at ASC
            LIMIT 8 OFFSET 0
            `
        )

        return res.status(200).json(result);

    } catch (err) {
        console.error('Error retrieving room inquiries: ', err);
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
});


// Commenting '/v1/inquiries'
// Integrating GoHighLevel means relying on their status name and pipeline stage
// Removed the status field on the inquiries table on postgres due to it. 

// dashboardRoute.get('/v1/inquiries', async (req, res) => {
//     try {

//         const result = await db.manyOrNone(
//             `SELECT
//                 status,
//                 COUNT(*) AS count
//             FROM inquiries
//             WHERE
//                 is_archived = false
//                 AND type = 'room_inquiry'
//             GROUP BY status`
//         );

//         const stats = [
//             { status: 'pending', count:  0 },
//             { status: 'contacted', count:  0 },
//             { status: 'converted', count:  0 },
//             { status: 'closed', count:  0 }
//         ];

//         result.forEach((item) => {
//             const stat = stats.find(s => s.status === item.status);

//             if (stat) {
//                 stat.count = Number(item.count);
//             }
//         });

//         return res.status(200).json(stats);

//     } catch (err) {
//         console.error('Error retrieving dashboard stats:', err);

//         return res.status(500).json({
//             message: 'Internal server error'
//         });
//     }
// });



dashboardRoute.get('/v1/inquiries', async (req, res) => {
    try {

        const result = await db.manyOrNone(
            `SELECT
                ghl_status,
                COUNT(*) AS count
            FROM inquiries
            WHERE
                is_archived = false
                AND type = 'room_inquiry'
            GROUP BY ghl_status`
        );

        const stats = [
            { ghl_status: 'open', count:  0 },
            { ghl_status: 'won', count:  0 },
            { ghl_status: 'closed', count:  0 },
            { ghl_status: 'abandoned', count:  0 }
        ];

        result.forEach((item) => {
            const stat = stats.find(s => s.ghl_status === item.ghl_status);

            if (stat) {
                stat.count = Number(item.count);
            }
        });

        return res.status(200).json(stats);

    } catch (err) {
        console.error('Error retrieving dashboard stats:', err);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});


dashboardRoute.get('/v1/rooms/best', async (req, res) => {
    try {

        const bestRoom = await db.manyOrNone(
            `SELECT
                r.room_uuid,
                r.title,
                r.type,
                COUNT(i.id) AS inquiry_count
            FROM rooms r
            INNER JOIN inquiries i
                ON r.room_uuid = i.room_uuid
            GROUP BY r.room_uuid, r.title, r.type
            ORDER BY inquiry_count DESC;`
        );

        return res.status(200).json(bestRoom);

    } catch (err) {
        console.error('Error retrieving room stats:', err);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
})

export default dashboardRoute;