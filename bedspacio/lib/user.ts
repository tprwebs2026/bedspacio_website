"use server"

import { cache } from "react"
import { cookies } from "next/headers";
import axios from 'axios'
import { BASE_URL } from "@/config/config";
import { error } from "console";


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


export const getCurrentUserInfo = async () => {
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


export const getAllUsers = async () => {
    try {

        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();
        
        const response = await axios.get(`${BASE_URL}/user/v1/users`,{
            headers: {
                Cookie: cookieHeader
            }
        })

        return response.data ?? [];

    } catch (err) {
        console.error('Error retreiving users: ', err);
        throw err;
    }
};



export const getUserInfo = async (id: number) => {
    try {

        const response = await axios.get(`${BASE_URL}/user/v1/users/${id}`, {
            withCredentials: true
        });

        return response.data;

    } catch (err) {
        console.error('Failed to retrieve user information: ', err);
    }
}

export const getPropertyManagers = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/user/v1/property_manager`, {
            withCredentials: true
        });

        return response.data;

    } catch (err) {
        console.error('Failed to retrieve property managers: ', err);
    }
}


export const deleteUser = async (id: number) => {
    try {
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();


        const response = await axios.delete(`${BASE_URL}/user/v1/users/${id}`, {
            headers: {
                Cookie: cookieHeader
            }
        });

        return response.data;
    } catch (err) {
        console.error('Failed to delete user: ', err);
        throw err;
    }
}