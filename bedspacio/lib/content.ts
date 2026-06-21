import axios from 'axios'
import { BASE_URL } from "@/config/config";


// HOME PAGE

// >> POST 
export const uploadYoutubeUrl = async (title: string, url: string) => {
    try {
        const response = await axios.put(
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
export const getHomePageBanner = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/content/v1/home-banner`,
            { withCredentials: true }
        );

        return response.data;
    } catch (err) {
        throw err;
    }
}


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

export const getBedspaceTypeImage = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/content/v1/room-type/bedspace_image`,
            { withCredentials:true }
        );
        return response.data;
    } catch (err) {
        throw err;
    }
}

export const getApartmentTypeImage = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/content/v1/room-type/apartment_image`,
            { withCredentials:true }
        );
        return response.data;
    } catch (err) {
        throw err;
    }
}

export const getWhyChooseUsImages = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/content/v1/why-choose-us`,
            { withCredentials: true }
        );

        return response.data;
    } catch (err) {
        throw err;
    }
}


// RENTALS

// >> GET
export const getRentalsPageBanner = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/content/v1/rentals-banner`,
            { withCredentials: true }
        );
        return response.data; 
    } catch (err) {
        throw err;
    }
}



// ABOUT US

// >> GET
export const getAboutUsPageBanner = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/content/v1/aboout-us-banner`,
            { withCredentials: true }
        );
        return response.data; 
    } catch (err) {
        throw err;
    }
}

export const getAboutUsWhoWeAreImage = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/content/v1/aboout-us/who-we-are`,
            { withCredentials: true }
        );
        return response.data; 
    } catch (err) {
        throw err;
    }
}

export const getAboutUsHistoryImage = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/content/v1/aboout-us/history`,
            { withCredentials: true }
        );
        return response.data; 
    } catch (err) {
        throw err;
    }
}



// HOW IT WORKS

export const getHowItWorksPageBanner = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/content/v1/how-it-works-banner`,
            { withCredentials: true }
        );

        return response.data; 
    } catch (err) {
        throw err;
    }
}


// CONTACT

export const getContactImage = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/content/v1/contacts`,
            { withCredentials: true }
        );

        return response.data; 
    } catch (err) {
        throw err;
    }
}