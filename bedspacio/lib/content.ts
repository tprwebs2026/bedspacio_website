import axios from 'axios'
import { BASE_URL } from "@/config/config";


// HOME PAGE

// >> POST 
export const uploadYoutubeUrl = async (title: string, url: string) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/content/v1/video_url`, 
            { youtube_title: title, youtube_url: url},
            { withCredentials: true }
        );

        return response.data;
    } catch (err) {
        throw err;
    }
}

// >> PATCH 


// >> GET
export const getYoutubeUrl = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/content/v1/video_url`,
            { withCredentials: true }
        );

        return response.data;
        
    } catch (err) {
        throw err;
    }
}


// RENTALS



// ABOUT US



// HOW IT WORKS