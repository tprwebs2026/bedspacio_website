// ----------------- Odoo ----------------- //

// "use server"

// import { BASE_URL } from '@/config/config'
// import { InquiryFormValues } from "./InquiryFormClient"
// import axios from "axios"

// export default async function SubmitInquiry(data: InquiryFormValues) {
//     try {
//         const crm_response = await axios.post(
//             `${BASE_URL}/inquiry/v1/crm-record/opportunity`, {
//                 public_room_id: data.public_room_id,
//                 starting_price: data.starting_price,
//                 fullname: data.fullname,
//                 contactNumber: data.contactNumber,
//                 email: data.email,
//                 schedule: data.schedule,
//                 targetMoveIn: data.targetMoveIn,
//                 monthsOfStay: data.monthsOfStay,
//                 other: data.other
//             }, {
//                 withCredentials: true
//             });

//             console.log("Submit Inquiry: ", crm_response.data);


//             if (!crm_response.data.success) {
//                 return {
//                     success: false,
//                     message: crm_response.data.message,
//                 };
//             };

//             return {
//                 success: true,
//                 message: crm_response.data.message,
//                 data: crm_response.data,
//             };

//     } catch (err) {
//         console.error('Something went wrong with the inquiry process: ', err);
//         return;
//     }
// }


// ------------- POSTGRES -------------- // 


// "use server"

// import { BASE_URL } from '@/config/config'
// import { InquiryFormValues } from "./InquiryFormClient"
// import axios from "axios"

// export default async function SubmitInquiry(data: InquiryFormValues, startingPrice: any) {
//     try {
//         const room_inquiry = await axios.post(
//             `${BASE_URL}/inquiry/v2/room-inquiry`, {
//                 room_uuid: data.room_uuid,
//                 starting_price: startingPrice,
//                 fullname: data.fullname,
//                 email: data.email,
//                 contact_number: data.contact_number,
//                 work_schedule: data.work_schedule,
//                 target_move_in: data.target_move_in,
//                 months_of_stay: data.months_of_stay,
//                 message: data.message
//             }, {
//                 withCredentials: true
//             });

//             console.log("Submit Inquiry: ", room_inquiry.data);


//             if (!room_inquiry.data.success) {
//                 return {
//                     success: false,
//                     message: room_inquiry.data.message,
//                 };
//             };

//             return {
//                 success: true,
//                 message: room_inquiry.data.message,
//                 data: room_inquiry.data,
//             };

//     } catch (err: any) {
//         console.error('Something went wrong with the inquiry process: ', err);
        
//         return {
//             success: false,
//             message:
//                 err?.response?.data?.message ||
//                 'Failed to submit inquiry'
//         };
//     }
// }


// ----------------------- KOMMO -------------------------- //



// "use server"

// import { BASE_URL } from '@/config/config'
// import { InquiryFormValues } from "./InquiryFormClient"
// import axios from "axios"

// export default async function SubmitInquiry(data: InquiryFormValues, startingPrice: any) {
//     try {

//         console.log('target move-in: ', data.target_move_in);

        
//         const room_inquiry = await axios.post(
//             `${BASE_URL}/kommo/leads/submit`, {
//                 room_uuid: data.room_uuid,
//                 starting_price: startingPrice,
//                 fullname: data.fullname,
//                 email: data.email,
//                 contact_number: data.contact_number,
//                 work_schedule: data.schedule,
//                 target_move_in: data.target_move_in,
//                 months_of_stay: Number(data.months_of_stay),
//                 message: data.message
//             }, {
//                 withCredentials: true
//             });

//             console.log("Submit Inquiry: ", room_inquiry.data);


//             if (!room_inquiry.data.success) {
//                 return {
//                     success: false,
//                     message: room_inquiry.data.message,
//                 };
//             };

//             return {
//                 success: true,
//                 message: room_inquiry.data.message,
//                 inquiry_id: room_inquiry.data.data?.leads?.create?.[0]?.id || Date.now(),
//                 reference_number: room_inquiry.data.reference_number,
//                 expected_response_time: room_inquiry.data.expected_response_time
//             };

//     } catch (err: any) {
//         console.error('Something went wrong with the inquiry process: ', err);
        
//         return {
//             success: false,
//             message:
//                 err?.response?.data?.message ||
//                 'Failed to submit inquiry'
//         };
//     }
// }



// ------------ GoHighLevel --------------------- //


"use server"

import { BASE_URL } from '@/config/config'
import { InquiryFormValues } from "./InquiryFormClient"
import axios from "axios"

export default async function SubmitInquiry(data: InquiryFormValues, startingPrice: any) {
    try {
        
        const response = await axios.post(
            `${BASE_URL}/gohighlevel/submissions`, {
                room_uuid: data.room_uuid,
                starting_price: startingPrice,
                fullname: data.fullname,
                email: data.email,
                contact_number: data.contact_number,
                work_schedule: data.work_schedule,
                target_move_in: data.target_move_in,
                months_of_stay: Number(data.months_of_stay),
                message: data.message
            }, {
                withCredentials: true
            });


            if (!response.data.success) {
                return {
                    success: false,
                    message: response.data.message,
                };
            };

            return {
                success: true,
                message: response.data.message,
                inquiry_id: response.data.data?.id || Date.now(),
                reference_number: response.data.referenceNumber
            };

    } catch (err: any) {
        console.error('Something went wrong with the inquiry process: ', err);
        return {
            success: false,
            message: err?.response?.data?.error || err?.message || 'Failed to submit inquiry'
        };
    }
}
