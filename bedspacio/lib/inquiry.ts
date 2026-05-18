import axios from 'axios';
import { cache } from 'react';
import { BASE_URL } from '@/config/config'
import { error } from 'console';


export const getAllInquiry = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/inquiry/v1`, {
            withCredentials: true
        });

        return response.data ?? [];

    } catch (err) {
        console.error('Failed to retrieve room inquiries;');
    }
}


export const getInquiryById = async (id: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/inquiry/v1/details/${id}`, {
            withCredentials: true
        });

        if (!response) return null;

        return response.data
    } catch (err) {
        console.error('Failed to retreive data: ', err);
    }
};


export const updateStatusById = async (id: number, status: string) => {
    try {
        const response = await axios.patch(`${BASE_URL}/inquiry/v1/status/${id}`, 
            { status: status }, { withCredentials: true }
        );

        return response.data;
    } catch (err) {
        console.error('Failed to update inquiry status: ', err);
    }
};


