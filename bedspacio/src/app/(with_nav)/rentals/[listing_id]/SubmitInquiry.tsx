"use server"

import { BASE_URL } from '@/config/config'
import { InquiryFormValues } from "./InquiryFormClient"
import axios from "axios"


export default async function SubmitInquiry (data: InquiryFormValues) {

    try {
        const response = await axios.post(
            `${BASE_URL}/room/v1/inquiry-record`, 
            {
                public_room_id: data.public_room_id,
                starting_price: data.starting_price,
                fullname: data.fullname,
                contactNumber: data.contactNumber,
                email: data.email,
                schedule: data.schedule,
                targetMoveIn: data.targetMoveIn,
                monthsOfStay: data.monthsOfStay,
                other: data.other || "",
            }, 
            {
                withCredentials: true
            }
        );
    
        console.log("Submit Inquiry: ", response.data);
        return {
            success: true,
            message: "Inquiry submitted successfully!",
            data: response.data,
        };

    } catch (err) {
        console.error('Something went wrong with the inquiry process: ', err);
        return;
    }
}