"use server"

import { cache } from "react"
import { cookies } from "next/headers";
import axios from 'axios'
import { BASE_URL } from "@/config/config";
import { redirect } from "next/navigation";


export const getCurrentUser = async () => {
    try {
        const cookieStore = await cookies();

        const response = await fetch(`${BASE_URL}/user/v1`, {
            method: "GET",
            headers: {
                Cookie: cookieStore.toString()
            },
            cache: "no-store"
        });

        if (response.status === 401) {
            return null;
        }

        if (!response.ok) {
            throw new Error(
                `Failed to retrieve user (${response.status})`
            );
        }

        const data = await response.json();
        return data.user;

    } catch (err: any) {
        console.error("getCurrentUser failed:", err.message);

        return null;
    }
};



export async function requireUser() {
    const user = await getCurrentUser();

    // Actual unauthenticated user
    if (!user) {
        redirect("/login");
    }

    return user;
}


export const getCurrentUserInfo = async () => {
    try {
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        const response = await axios.get(
            `${BASE_URL}/user/v1/profile`, 
            {
                headers: {
                    Cookie: cookieHeader
                },
                withCredentials: true
            }
        );
        return response.data;
    } catch (err: any) {
        console.error(
            "Profile fetch failed:",
            err?.message
        );

        throw err;
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


export const changePassword = async (
    oldPass: string,
    newPass: string,
    confirmPass: string
) => {

    
    try {

        console.log(axios.patch.toString());
        console.log("REQUEST METHOD: PATCH");

        const password = await axios.patch(
            `${BASE_URL}/user/v1/password`, 
                {
                    old_password: oldPass,
                    new_password: newPass,
                    confirm_password: confirmPass
                },
                {
                    withCredentials: true
                }
        );

        return password.data;

    } catch (error: any) {
        throw error;
    }
}