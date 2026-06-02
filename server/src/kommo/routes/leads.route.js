import express from 'express';
import kommoClient from '../utils/kommoClient.js';
import { customAlphabet } from 'nanoid';

const leadRoute = express.Router();

leadRoute.post(
    '/leads/submit',
    async (req, res) => {

        try {
            // request from body
            const {
                room_uuid,
                starting_price,
                fullname,
                contact_number,
                email,
                work_schedule,
                target_move_in,
                months_of_stay,
                message
            } = req.body;


            const nanoid = customAlphabet(
                'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
                8
            );

            const reference_number = `INQ-${nanoid()}`; // sample reference number: INQ-8N8KGQ6N

            const payload = [
                {
                    name: `Room Inquiry - ${fullname} (${room_uuid})`,
                    price: Number(starting_price) || 0,
                    // These fields are tied to the Lead Card (the "Inquiry" tab)
                    custom_fields_values: [
                        { field_id: 2133652, values: [{ value: String(reference_number) }] },
                        { field_id: 2133712, values: [{ value: String(email) }] },
                        { field_id: 2133714, values: [{ value: String(contact_number) }]},
                        { field_id: 2133568, values: [{ value: String(room_uuid) }] },
                        { field_id: 2181142, values: [{ value: String(work_schedule || "") }] },
                        { field_id: 2133828, values: [{ value: String(months_of_stay || "") }] },
                        { field_id: 2133756, values: [{ value: String(target_move_in) }] },
                        { field_id: 2133838, values: [{ value: String(message || "") }] }
                    ],
                    // These fields create and populate the linked Contact Profile card natively
                    _embedded: {
                        contacts: [
                            {
                                first_name: fullname,
                                custom_fields_values: [
                                    {
                                        field_code: "PHONE",
                                        values: [
                                            {
                                                value: String(contact_number),
                                                enum_code: "WORK"
                                            }
                                        ]
                                    },
                                    {
                                        field_code: "EMAIL",
                                        values: [
                                            {
                                                value: String(email),
                                                enum_code: "WORK"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            ];


            console.log('Kommo payload: ', payload);
            console.log('Target move in: ', formattedMoveInDate);

            const response = await kommoClient.post(
                `/leads/complex`,
                payload
            );

            return res.status(200).json({
                success: true,
                message: 'Inquiry processed successfully',
                reference_number: reference_number,
                expected_response_time: 'Within 24 Hours',
                data: response.data
            });

        } catch (error) {
            console.error('Kommo API Error:', error.response?.data || error.message);
            return res.status(500).json({ 
                success: false,
                message: error.response?.data?.title || 'Failed to process lead' 
            });
        }
    }
)


export default leadRoute;