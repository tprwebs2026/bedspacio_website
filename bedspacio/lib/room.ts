import { cache } from "react"
import axios from 'axios'
import { BASE_URL } from "@/config/config";
import { RoomImage } from "@/app/(with_nav)/rentals/[listing_id]/RoomImage";

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

export const getRoomDetails = cache(async (room_id: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/room/v1/detail/${room_id}`);

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
        return response?.data ?? [];
    } catch (err) {
        console.log('Failed to retrieve inclusions: ', err);
        return [];
    }
})