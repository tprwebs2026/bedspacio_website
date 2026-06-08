
// ------------- FOR ODOO -------------- //

// "use server"

// import { inquiryFormValues } from "./page"
// import axios from "axios";
// import { BASE_URL } from "@/config/config";

// export default async function SubtmitContactInquiry (data: inquiryFormValues ) {

//     /*
//         > Inquiry form from contact-us
//         > not a lead, only pure inquiries
//     */

//     try {
//         const response = await axios.post(`${BASE_URL}/inquiry/v1/crm-record/lead`, {
//             fullname: data.fullname,
//             contactNumber: data.contactnumber,
//             email: data.email,
//             subject: data.subject,
//             message: data.message
//         }, {
//             withCredentials: true
//         });

//         console.log('[Home] Form submission response: ', response.data);
//         if (!response.data.success) {
//             return {
//                 success: false,
//                 message: response.data.message,
//             };
//         };

//         return {
//             success: true,
//             message: response.data.message,
//             data: response.data,
//         };

//     } catch (err: any) {
//         console.error('Inquiry error:', err);
        
//         return {
//             success: false,
//             message:
//                 err?.response?.data?.message ||
//                 err?.message ||
//                 'Unexpected error occurred',
//         };
//     }
// }