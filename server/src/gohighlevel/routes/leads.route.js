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
                    message
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
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
                message
            ]
        );

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
    Shows the status of inquiries on the admin Inquiry page when updating the status on  GoHighLevel

*/

highRoute.post('/status-change', async (req, res) => {
    try {
        const secret = req.headers["x-webhook-secret"];

        if (secret !== "bedspacio_webhook_secret_2026") {
            return res.status(401).json({
                success: false,
                message: "Invalid webhook secret"
            });
        }

        console.log("WEBHOOK VERIFIED");
        console.log(req.body);

        const {
            contact_id,
            id: opportunity_id,
            status,
            pipleline_stage,
            customData
        } = req.body;

        const referenceNumber = customData?.referenceNumber;

        await db.none(
            `
            UPDATE inquiries
            SET
                ghl_contact_id = $1,
                ghl_opportunity_id = $2,
                ghl_pipeline_stage = $3,
                ghl_status = $4,
                updated_at = NOW()
            WHERE reference_number = $5
            `,
            [
                contact_id,
                opportunity_id,
                pipleline_stage,
                status,
                referenceNumber
            ]
        );

        return res.status(200).json({
            success: true
        });


    } catch (err) {
        console.log('Webhook from Go High Level is not working: ', err);
    }
})





export default highRoute;
