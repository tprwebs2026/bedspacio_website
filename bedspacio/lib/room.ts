import { cache } from "react"
import axios from 'axios'
import { BASE_URL } from "@/config/config";


type RoomListingParams = {
    page?: number,
    pageSize?: number,
    room_type?: string,
    branch?:number,
    minimumBudget?:number,
    maximumBudget?: number,
    inclusion?: string[]
}

export const getRoomListings = cache(async ({
    page = 1, 
    pageSize = 8,
    room_type,
    branch,
    minimumBudget,
    maximumBudget,
    inclusion
}: RoomListingParams) => {

    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize)
    });

    if (room_type) params.append("room_type", room_type);
    if (branch) params.append("branch", String(branch));
    if (minimumBudget) params.append("minimumBudget", String(minimumBudget));
    if (maximumBudget) params.append("maximumBudget", String(maximumBudget));

    if (inclusion ) {
        const inclusions = Array.isArray(inclusion) ? inclusion : [inclusion];
        inclusions.forEach(inc => params.append("inclusion", inc));
    }


    const response = await axios.get(`${BASE_URL}/room/v1/listing?${params.toString()}`, { withCredentials: true })
    return response.data ?? [];
})



export const getRoomDetails = cache(async (room_uuid: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/room/v1/detail/${room_uuid}`);

        console.log(response.data);
        return response.data ;
    } catch (err) {
        console.error('Failed to fetch room data: ', err);
        return;
    }
})


export const getInclusions = cache(async () => {
    try {
        const response = await axios.get(`${BASE_URL}/inclusion/v1`, { withCredentials: true });
        return response?.data?.data ?? [];
    } catch (err) {
        console.log('Failed to retrieve inclusions: ', err);
        return [];
    }
})


// export const setLeadRecord = async (formData: InquiryFormValues) => {
//     try {
//         const response = await axios.post(`${BASE_URL}/room/v1/lead-record`, formData, {
//             withCredentials: true
//         })

//         console.log('[setLeadRecord] Created Record: ', response.data);
//         return response.data;
//     } catch (err) {
//         console.log('Error create new lead record: ', err);
//     }
// }



// From database

// export const getRooms = async (page: number) => {
//     try {
//         const response = await axios.get(`${BASE_URL}/room/v1/admin/all?page=${page}`, {
//             withCredentials: true
//         });

//         return response.data ?? [];
//     } catch (err) {
//         console.error('Error retrieving rooms: ', err)
//     }
// }

export const getRooms = async ({
    page,
    branch,
    type,
    search
}: {
    page: number;
    branch?: string;
    type?: string;
    search?: string;
}) => {
    try {
        const response = await axios.get(`${BASE_URL}/room/v1/admin/all`, {
            params: {
                page,
                branch,
                type,
                search
            },
            withCredentials: true
        });

        return response.data;
    } catch (err) {
        console.error('Error retrieving rooms: ', err);
        return {
            data: [],
            currentPage: 1,
            totalPage: 1
        };
    }
};



export const getRoomById = async (room_uuid: number) => {
    try {

        if (Number.isNaN(room_uuid)) {
            throw new Error('room_uuid is NaN');
        }


        const response = await axios.get(`${BASE_URL}/room/v1/${room_uuid}/info`, {
            withCredentials: true
        });

        return response.data;
    } catch (err) {
        console.error('Error retrieving room: ', err);
    }
}

export const getRoomPreviews = async ({
    page = 1, 
    pageSize = 8,
    room_type,
    branch,
    minimumBudget,
    maximumBudget,
    inclusion
}: RoomListingParams) => {
    try {

        const params = new URLSearchParams({
            page: String(page),
            pageSize: String(pageSize)
        });

        if (room_type) params.append("type", room_type);
        if (branch) params.append("branch", String(branch));
        if (minimumBudget) params.append("minimumBudget", String(minimumBudget));
        if (maximumBudget) params.append("maximumBudget", String(maximumBudget));

        if (inclusion ) {
            const inclusions = Array.isArray(inclusion) ? inclusion : [inclusion];
            inclusions.forEach(inc => params.append("inclusion", inc));
        }


        const response = await axios.get(`${BASE_URL}/room/v1/preview/details?${params.toString()}`, {
            withCredentials: true
        });

        return response.data ?? [];
    } catch (err) {
        console.error('Error retrieving rooms: ', err);
    }
} 


export const getRoomPreviewById = async (id: number) => {
    try {
        const result = await axios.get(`${BASE_URL}/room/v1/preview/${id}/details`, {
            withCredentials: true
        });

        return result.data;

    } catch (err) {
        console.error('Error retrieving room details: ', err);
    }
}