"use server"

import { cache } from "react"
import { cookies } from "next/headers";
import axios from 'axios'
import { BASE_URL } from "@/config/config";


export const getCurrentUser = cache( async () => {
    try {
        const cookieStore = await cookies();

        const response = await fetch(`${BASE_URL}/user/v1`, {
            method: 'GET',
            headers: {
                Cookie: cookieStore.toString()
            },
            cache: 'no-store'
        })

        if (!response.ok) {
            throw new Error('Failed to retrieve user credentials');
        }

        const data = await response.json();

        console.log('user: ', data.user);

        return data.user;

    } catch (err) {
        console.log('Error retrieving user data: ', err);
    }
});


export const getUserInfo = async () => {
    try {
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        const response = await axios.get(`${BASE_URL}/user/v1/profile`, {
            headers: {
                Cookie: cookieHeader
            }
        });

        console.log('response for user info: ', response.data);

        return response.data;
    } catch (err) {
        console.error('Error retreiving profile data: ', err);
    }
};  