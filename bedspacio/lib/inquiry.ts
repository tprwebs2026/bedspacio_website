import axios from 'axios';
import { cache } from 'react';
import { BASE_URL } from '@/config/config'
import { cookies } from "next/headers";


// export const getAllInquiry = async () => {
//     try {
//         const response = await axios.get(`${BASE_URL}/inquiry/v1`, {
//             withCredentials: true
//         });

//         return response.data ?? [];

//     } catch (err) {
//         console.error('Failed to retrieve room inquiries;');
//     }
// }



/*
    6-8-2026
    1. use this function if GoHighLevel is Integrated
*/

export const getAllInquiry = async (params: {
    ghl_status?: string;
    page?: number;
    search?: string;
} = {}) => {
    const response = await axios.get(`${BASE_URL}/inquiry/v1`, {
        params: {
            ghl_status: params.ghl_status || undefined,
            page: params.page || 1,
            search: params.search || undefined,
        },
        withCredentials: true,
    });

    return response.data;
};


/*
    6-8-2026
    1. This is a fallback if GoHighLevel is not integrated
*/

export const getAllInquiries = async (params: {
    inq_status?: string;
    page?: number;
    search?: string;
} = {}) => {
    const response = await axios.get(`${BASE_URL}/inquiry/v2/fallback`, {
        params: {
            inq_status: params.inq_status || undefined,
            page: params.page || 1,
            search: params.search || undefined,
        },
        withCredentials: true,
    });

    return response.data;
};



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


export const getRoomID = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/inquiry/v1/room_uuid`, {
            withCredentials: true
        });

        return response.data ?? [];
    } catch (err) {
        throw err;
    }
}


/*
    Temporarily commenting out to do fallbacks if GHL integration is not made
*/

// export const updateStatusById = async (id: number, status: string) => {
//     try {
//         const response = await axios.patch(`${BASE_URL}/inquiry/v1/status/${id}`, 
//             { status: status }, 
//             { 
//                 withCredentials: true,
//             },
//         );

//         return response.data;
//     } catch (err) {
//         console.error('Failed to update inquiry status: ', err);
//     }
// };


export const updateStatusById = async (id: number, status: string) => {
    try {
        const response = await axios.patch(`${BASE_URL}/inquiry/v1/status/${id}`, 
            { status: status }, 
            { 
                withCredentials: true,
            },
        );

        return response.data;
    } catch (err) {
        console.error('Failed to update inquiry status: ', err);
    }
};


/* USE THIS AS FALLBACK IF GHL is not INTEGRATED */
export const updateInquiryStatusById = async (id: number, status: string) => {
    try {
        const response = await axios.patch(`${BASE_URL}/inquiry/v2/status/${id}/fallback`, 
            { inq_status: status }, 
            { 
                withCredentials: true,
            },
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

export const archiveInquiryMultiple = async (ids: number[]) => {
    try {
        const response = await axios.patch(
            `${BASE_URL}/inquiry/v1/archive/multiple`,
                { ids },
                { withCredentials: true }
        );

        return response;

    } catch (err) {
        throw err;
    }
}



export const unarchiveInquiryMultiple = async (ids: number[]) => {
    try {
        const response = await axios.patch(
            `${BASE_URL}/inquiry/v1/unarchive/multiple`, 
            { ids },
            {  withCredentials: true }
        )

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


export const getAllArchivedInquiries = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/inquiry/v2/archived/fallback`, {
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


export const deleteMultipleArchived = async (ids: number[]) => {
    try {
        const response = await axios.delete(
            `${BASE_URL}/inquiry/v1/archive/multiple`, { 
                data:{ ids },
                withCredentials: true 
            }
        );

        return response.data;

    } catch (err) {
        throw err;
    }
}