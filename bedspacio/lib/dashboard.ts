import { BASE_URL } from "@/config/config";
import axios from "axios";


// Use this to count inquiry status counts
// Will be used if GHL is integrated
export const getInquiryCounts = async () => {
    try {
        const stats = await axios.get(
            `${BASE_URL}/dashboard/v1/inquiries`, {
            withCredentials: true
        });

        return stats.data ?? [];

    } catch (err) {
        throw err;
    }
}


// use this as FALLBACK
// If GHL is not integrated, count the inquiries from the inquiries table in database
export const getInquiryStageCounts = async () => {
    try {
        const stages = await axios.get(
            `${BASE_URL}/dashboard/v2/inquiries/count`,
            { withCredentials: true }
        );

        return stages.data;
    } catch (err) {
        throw err;
    }
}


export const getRecentInquiries = async () => {
    try {

        const result = await axios.get(
            `${BASE_URL}/dashboard/v1/inquiry/new-leads`,
            { withCredentials: true }
        );

        return result.data ?? [];

    } catch (err) {
        throw err;
    }
}

export const getNewLeadInquiries = async () => {
    try {

        const result = await axios.get(
            `${BASE_URL}/dashboard/v2/inquiry/new-leads`,
            { withCredentials: true }
        );

        return result.data ?? [];

    } catch (err) {
        throw err;
    }
}


export const getBestRooms = async (type?: string) => {
    try {

        const rooms = await axios.get(
            `${BASE_URL}/dashboard/v1/rooms/best`,
            {
                params: {
                    type
                },
                withCredentials: true
            }
        );

        return rooms.data ?? [];

    } catch (err) {
        throw err;
    }
}