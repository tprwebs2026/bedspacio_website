import express from 'express';
import goHighLevelClient from '../config/goHighLevelClient.js';
import { db } from '../../config/database.js';
import { customAlphabet } from 'nanoid';


const highRoute = express.Router();

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 10);

highRoute.post(`/submissions`, async(req , res) => {
    try {

        const { 
            room_uuid,
            starting_price, // only for postgres
            type = 'room_inquiry', // only for postgres
            fullname,
            contact_number,
            email,
            work_schedule,
            target_move_in,
            months_of_stay,
            message
        } = req.body;

        // Generate your inquiry reference number locally using nanoid
        const referenceNumber = `INQ-${nanoid(10).toUpperCase()}`;

        let ghlContactId;

        // Check if contact already exists in GHL
        const duplicateContactResponse =
            await goHighLevelClient.get(
                '/contacts/search/duplicate',
                {
                    params: {
                        locationId: process.env.GHL_LOCATION_ID,
                        email
                    }
                }
            );

        const existingContact = duplicateContactResponse.data?.contact;

        if (existingContact?.id) {
            ghlContactId = existingContact.id;

            console.log(
                'Existing GHL Contact Found:',
                ghlContactId
            );
        } else {
            const contactPayload = {
                name: fullname,
                email: email,
                phone: contact_number,
                locationId: process.env.GHL_LOCATION_ID,
                tags: [ 
                    'Rental Inquiry', 
                    `Room-ID-${room_uuid}` 
                ]
            };
    
            const contactResponse = await goHighLevelClient.post(
                `/contacts/`,
                contactPayload
            );
    
            ghlContactId = contactResponse.data.contact.id;

            if (!ghlContactId) {
                throw new Error(
                    'Failed to create GHL contact'
                );
            }

            console.log('New GHL contact created: ', ghlContactId);
        }


        const opportunityPayload = {
            pipelineId: process.env.GHL_PIPELINE_ID,
            pipelineStageId: process.env.GHL_STAGE_ID,
            locationId: process.env.GHL_LOCATION_ID,
            contactId: ghlContactId,
            name: `${fullname} - Room Inquiry`,
            status: 'open',
            monetaryValue: Number(starting_price) * Number(months_of_stay),

            customFields: [
                { key: 'reference_number', value: referenceNumber },
                { key: 'room_uuid', value: room_uuid },
                { key: 'work_schedule', value: work_schedule },
                { key: 'target_movein', value: target_move_in },
                { key: 'months_of_stay', value: Number(months_of_stay) },
                { key: 'message', value: message }
            ]
        }

        console.log('Sending Opportunity Payload to GHL...');
        const opportunityResponse = await goHighLevelClient.post('/opportunities/', opportunityPayload);

        const ghlOpportunityId = opportunityResponse.data?.opportunity?.id;

        if (!ghlOpportunityId) {
            throw new Error('Failed to create GHL opportunity');
        }

        console.log('GHL Opportunity Created:', ghlOpportunityId );

        // saving the record to POSTGRES first
        const inquiry = await db.oneOrNone(
            `
            INSERT INTO inquiries (
                reference_number, 
                room_uuid,
                starting_price,
                type,
                fullname,
                contact_number,
                email,
                work_schedule,
                target_move_in,
                months_of_stay,
                message,
                ghl_contact_id,
                ghl_opportunity_id,
                ghl_pipeline_stage,
                ghl_status
            ) VALUES (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15
            ) RETURNING *
            `,
            [ 
                referenceNumber, 
                room_uuid, 
                starting_price, 
                type, fullname, 
                contact_number, 
                email,  
                work_schedule,
                target_move_in,
                months_of_stay,
                message,
                ghlContactId,
                ghlOpportunityId,
                'New Lead',
                'open'
            ]
        );

        console.log(
            'Inquiry Saved To Database:',
            inquiry.id
        );

        // Response back to your Next.js frontend
        return res.status(200).json({
            success: true,
            message: 'Inquiry successfully processed and added to GHL New Lead stage.',
            referenceNumber: referenceNumber,
            crm_contact_id: ghlContactId,
            crm_opportunity_id: opportunityResponse.data.opportunity.id,
            data: inquiry
        });


    } catch (error) {
        if (error.response) {
            console.error('GHL Validation Error Details:', error.response.data);
            return res.status(error.response.status).json({ error: error.response.data.message });
        }
        
        console.error('System Failure:', error.message);
        return res.status(500).json({ error: 'Server could not process inquiry' });
    }
});


highRoute.post('/submissions/manual', async (req, res) => {
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

        // Generate your inquiry reference number locally using nanoid
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

        let ghlContactId;

        // Check if contact already exists in GHL
        const duplicateContactResponse =
            await goHighLevelClient.get(
                '/contacts/search/duplicate',
                {
                    params: {
                        locationId: process.env.GHL_LOCATION_ID,
                        email
                    }
                }
            );

        const existingContact = duplicateContactResponse.data?.contact;

        if (existingContact) {
            console.log(
                'Existing GHL Contact Found:',
                existingContact.id
            );

            ghlContactId = existingContact.id;
        } else {
            const GoHighLevelPayload = {
                name: fullname,
                email: email,
                phone: contact_number,
                locationId: process.env.GHL_LOCATION_ID,
                tags: [ 'Rental Inquiry', `Room-ID-${room_uuid}` ],
            };

            const contactResponse = await goHighLevelClient.post(
                `/contacts/`,
                GoHighLevelPayload
            );

            ghlContactId = contactResponse.data.contact.id;
            console.log('New GHL contact created: ', ghlContactId);
        }

        // Creating an opportunity payload
        const opportunityPayload = {
            pipelineId: process.env.GHL_PIPELINE_ID,
            pipelineStageId: process.env.GHL_STAGE_ID,
            locationId: process.env.GHL_LOCATION_ID,
            contactId: ghlContactId,
            name: `${fullname} - Room Inquiry`,
            status: 'open',
            monetaryValue: Number(room.price) * Number(months_of_stay),

            customFields: [
                { key: 'reference_number', value: referenceNumber },
                { key: 'room_uuid', value: room_uuid },
                { key: 'work_schedule', value: work_schedule },
                { key: 'target_movein', value: target_move_in },
                { key: 'months_of_stay', value: Number(months_of_stay) },
                { key: 'message', value: note }
            ]
        };


        console.log('Sending Opportunity Payload to GHL...');
        const opportunityResponse = await goHighLevelClient.post('/opportunities/', opportunityPayload);
        console.log('Opportunity Payload to GHL sent.');

        if (opportunityResponse) {
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
                    ghl_contact_id,
                    ghl_opportunity_id,
                    ghl_pipeline_stage,
                    ghl_status
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
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
                    ghlContactId,
                    opportunityResponse.data.opportunity.id,
                    'New Lead',
                    'open'
                ]
            );

            // Response back to your Next.js frontend
            return res.status(200).json({
                success: true,
                message: 'Inquiry successfully processed and added to GHL New Lead stage.',
                referenceNumber: referenceNumber,
                crm_contact_id: ghlContactId,
                crm_opportunity_id: opportunityResponse.data.opportunity.id,
                data: record
            });
        }

        

    } catch (err) {
        console.log('Error creating new inquiry record in admin: ', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})



/*
    This is a fallback if a user tries to create an Opportunity inside GHL directly and not on the Inquiry page on website

    - no reference should be added there 
    - once the opportunity is created this POST route will be triggered by the webhook and this POST route will update the reference number
*/
highRoute.post('/fallback/opportunity-created', async (req, res) => {
    try {
        const secret = req.headers['x-webhook-secret'];

        if (secret !== process.env.WEBHOOK_SECRET) {
            return res.status(401).json({
                success: false,
                message: 'Invalid webhook secret'
            });
        }

        const {
            room_uuid,
            message,
            work_schedule,
            target_move_in,
            months_of_stay,
            contact_id,
            id: opportunity_id,
            full_name,
            email,
            phone,
            status,
            pipleline_stage
        } = req.body;

        console.log('=================================');
        console.log('GHL FALLBACK OPPORTUNITY CREATED');
        console.log(req.body);
        console.log('=================================');

        // Prevent duplicate creation
        const existingInquiry = await db.oneOrNone(
            `
            SELECT id
            FROM inquiries
            WHERE ghl_opportunity_id = $1
            `,
            [opportunity_id]
        );

        if (existingInquiry) {
            return res.status(200).json({
                success: true,
                message: 'Inquiry already exists'
            });
        }

        const referenceNumber =
            `INQ-${nanoid(10).toUpperCase()}`;

        const inquiry = await db.one(
            `
            INSERT INTO inquiries (
                type,
                fullname,
                contact_number,
                email,
                reference_number,
                ghl_contact_id,
                ghl_opportunity_id,
                ghl_pipeline_stage,
                ghl_status
            )
            VALUES (
                $1,$2,$3,$4,$5,$6,$7,$8,$9
            )
            RETURNING *
            `,
            [   
                'room_inquiry',
                full_name || '',
                phone || '',
                email || '',
                referenceNumber,
                contact_id,
                opportunity_id,
                pipleline_stage || 'New Lead',
                status || 'open'
            ]
        );

        // Update the GHL opportunity with the generated reference number
        await goHighLevelClient.put(
            `/opportunities/${opportunity_id}`,
            {
                customFields: [
                    {
                        key: "reference_number",
                        value: referenceNumber
                    }
                ]
            }
        );

        const { customData } = req.body;

        await db.none(
            `
            UPDATE inquiries
            SET
                room_uuid = $1,
                message = $2,
                work_schedule = $3,
                target_move_in = $4,
                months_of_stay = $5,
                updated_at = NOW()
            WHERE ghl_opportunity_id = $6
            `,
            [
                customData.room_uuid,
                customData.message,
                customData.work_schedule,
                customData.target_move_in,
                Number(customData.months_of_stay),
                opportunity_id
            ]
        );

        return res.status(200).json({
            success: true,
            data: inquiry
        });

    } catch (err) {
        console.log(
            JSON.stringify(err.response?.data, null, 2)
        );

        return res.status(500).json({
            success: false
        });

        return res.status(500).json({
            success: false
        });
    }
});


/*
    Shows the status of inquiries on the admin Inquiry page when updating the status on  GoHighLevel

*/

highRoute.post('/status-change', async (req, res) => {
    try {
        const secret = req.headers["x-webhook-secret"];

        if (secret !== process.env.WEBHOOK_SECRET) {
            return res.status(401).json({
                success: false,
                message: "Invalid webhook secret"
            });
        }

        console.log('=================================');
        console.log("WEBHOOK VERIFIED");
        console.log(req.body);
        console.log(JSON.stringify(req.body, null, 2));
        console.log('=================================');

        const {
            contact_id,
            id: opportunity_id,
            status,
            pipleline_stage,
            customData
        } = req.body;

        console.log({
            contact_id,
            opportunity_id,
            status,
            pipleline_stage,
            customData
        });

        const referenceNumber = customData?.referenceNumber;

        if (!referenceNumber) {
            return res.status(400).json({
                success: false,
                message: 'Missing reference number'
            });
        }

        const updates = [];
        const values = [];

        if (contact_id) {
            updates.push(
                `ghl_contact_id = $${values.length + 1}`
            );
            values.push(contact_id);
        };

        if (opportunity_id) {
            updates.push(
                `ghl_opportunity_id = $${values.length + 1}`
            );
            values.push(opportunity_id);
        };

        if (pipleline_stage) {
            updates.push(
                `ghl_pipeline_stage = $${values.length + 1}`
            );
            values.push(pipleline_stage);
        };

        if (status) {
            updates.push(
                `ghl_status = $${values.length + 1}`
            );
            values.push(status);
        };

        updates.push('updated_at = NOW()');
        values.push(referenceNumber);

        const result = await db.result(
            `
            UPDATE inquiries
            SET ${updates.join(', ')}
            WHERE reference_number = $${values.length}
            `,
            values
        );

        console.log(`Rows Updated: ${result.rowCount}`);

        return res.status(200).json({
            success: true,
            updated_rows: result.rowCount
        });


    } catch (err) {
        console.log('Webhook from Go High Level is not working: ', err);
    }
})



highRoute.post('/opportunity-sync', async (req, res) => {
    try {

        const secret = req.headers["x-webhook-secret"];
        if (secret !== process.env.WEBHOOK_SECRET) {
            return res.status(401).json({
                success: false
            })
        };

        console.log(req.body);

        const {
            id: opportunity_id,
            customData
        } = req.body;

        const updates= [];
        const values = [];

        if (customData?.room_uuid) {
            updates.push(`room_uuid = $${values.length + 1}`);
            values.push(customData.room_uuid);
        }

        if (customData?.message) {
            updates.push(`message = $${values.length + 1}`);
            values.push(customData.message);
        }

        if (customData?.work_schedule) {
            updates.push(`work_schedule = $${values.length + 1}`);
            values.push(customData.work_schedule);
        }

        if (customData?.target_move_in) {
            updates.push(`target_move_in = $${values.length + 1}`);
            values.push(customData.target_move_in);
        }

        if (customData?.months_of_stay) {
            updates.push(`months_of_stay = $${values.length + 1}`);
            values.push(customData.months_of_stay);
        }

        updates.push(`updated_at = NOW()`);
        values.push(opportunity_id);

        if (updates.length === 1) {
            return res.status(200).json({
                success: true,
                message: 'No fields to update'
            });
        };

        await db.result(
            `
            UPDATE inquiries
            SET ${updates.join(', ')}
            WHERE ghl_opportunity_id = $${values.length}
            `,
            values
        );
        
        return res.status(200).json({
            success: true
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false
        });
    }
})


highRoute.post('/contact-sync', async (req, res) => {
    try {

        const secret = req.headers["x-webhook-secret"];
        if (secret !== process.env.WEBHOOK_SECRET) {
            return res.status(401).json({
                success: false
            })
        };

        console.log(req.body);

        const {
            contact_id,
            customData
        } = req.body;

        const updates= [];
        const values = [];

        if (customData?.full_name) {
            updates.push(`fullname = $${values.length + 1}`);
            values.push(customData.full_name);
        }

        if (customData?.email) {
            updates.push(`email = $${values.length + 1}`);
            values.push(customData.email);
        }

        if (customData?.phone) {
            updates.push(`contact_number = $${values.length + 1}`);
            values.push(customData.phone);
        }

        updates.push(`updated_at = NOW()`);
        values.push(contact_id);

        if (updates.length === 1) {
            return res.status(200).json({
                success: true,
                message: 'No fields to update'
            });
        };

        await db.result(
            `
            UPDATE inquiries
            SET ${updates.join(', ')}
            WHERE ghl_contact_id = $${values.length}
            `,
            values
        );
        
        return res.status(200).json({
            success: true
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false
        });
    }
})


highRoute.delete('/opportunity', async (req, res) => {
    try {

    } catch(err) {
        

        return res.status(500).json({
            success: false
        })
    }
})



export default highRoute;
