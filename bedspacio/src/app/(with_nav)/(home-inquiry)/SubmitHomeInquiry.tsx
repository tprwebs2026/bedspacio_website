"use server" 

import axios from 'axios';
import { BASE_URL } from '@/config/config'
import { InquiryValues } from "@/app/(with_nav)/(home-inquiry)/HomeInquiry";

export default async function SubmitHomeInquiry (data: InquiryValues) {

    try {
        const response = await axios.post(`${BASE_URL}/inquiry/v1/crm-record/lead`, {
            fullname: data.fullname,
            contactNumber: data.contactNumber,
            email: data.email,
            subject: data.subject,
            message: data.message
        }, {
            withCredentials: true
        });

        console.log('[Home] Form submission response: ', response.data);
        if (!response.data.success) {
            return {
                success: false,
                message: response.data.message,
            };
        };

        return {
            success: true,
            message: response.data.message,
            data: response.data,
        };

    } catch (err: any) {
        console.error('Inquiry error:', err);
        
        return {
            success: false,
            message:
                err?.response?.data?.message ||
                err?.message ||
                'Unexpected error occurred',
        };
    }
}