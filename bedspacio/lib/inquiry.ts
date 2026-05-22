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


export const deleteSingleInquiry = async (id: number) => {
    try {
        const response = await axios.delete(`${BASE_URL}/inquiry/v1/${id}`, {
            withCredentials: true
        });

        return response.data;

    } catch (err) {
        throw err;
    }
}


export const deleteMultipleInquiry = async (ids: number[]) => {
    try {
        const response =  await axios.delete(`${BASE_URL}/inquiry/v1/multiple`, {
            data: ids,
            withCredentials: true
        })

        return response;

    } catch (err) {
        throw err;
    }
}


export const addNewNote = async (id: number, note: string, user_id: number) => {
    try {
        if (!note.trim()) {
            console.log('Note is empty');
            
            return; 
        }

        const response = await axios.post(`${BASE_URL}/inquiry/v1/${id}/note`, {
            note: note,
            created_by: user_id
        }, { withCredentials: true });


        return response.data;

    } catch (err) {
        throw err;
    }
}


export const archiveInquirySingle = async (id: number) => {
    try {
        const response = await axios.patch(
            `${BASE_URL}/inquiry/v1/archive/${id}`,
            { }, 
            { withCredentials: true }
        );

        return response;

    } catch (err) {
        throw err;
    }
}


export const archiveInquiryMultiple = async (ids: number[]) => {
    try {
        const response = await axios.patch(
            `${BASE_URL}/inquiry/v1/archive/multiple`,
                ids,
                { withCredentials: true }
        );

        return response;

    } catch (err) {
        throw err;
    }
}


export const unarchivedInquirySingle = async (id: number) => {
    try {
        const response = await axios.patch(
            `${BASE_URL}/inquiry/v1/unarchive/${id}`,
            { }, 
            { withCredentials: true }
        );

        return response;

    } catch (err) {
        throw err;
    }
}


export const getArchivedInquiries = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/inquiry/v1/archived`, {
            withCredentials: true
        });

        return response.data ?? [];

    } catch (err) {
        throw err;
    }
}


export const getArchivedSingleById = async (id: number) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/inquiry/v1/details/${id}/archived`, {
                withCredentials: true
            }
        );

        return response.data;

    } catch (err) {
        throw err;``
    }
}


export const deleteSingleArchived = async (id: number) => {
    try {
        const response = await axios.delete(`${BASE_URL}/inquiry/v1/archived/${id}`, {
            withCredentials: true
        });

        return response.data;

    } catch (err) {
        throw err;
    }
}