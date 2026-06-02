import { BASE_URL } from "@/config/config";
import axios from "axios";


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