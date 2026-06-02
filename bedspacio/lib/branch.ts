import axios from 'axios'
import { cache } from 'react';
import { BASE_URL } from '@/config/config'

export interface Branch {
    id:number,
    name:string,
    branch_image: string,
    address:string
}

export const getBranches = cache( async () => {
    const response = await axios.get(`${BASE_URL}/branch/v1`, { withCredentials: true });
    return response.data ?? [];
});



// Get Property Manager data from Odoo
export const getManagers = cache( async () => {
    const response = await axios.get(`${BASE_URL}/manager/v1`, { withCredentials: true });
    return response.data ?? [];
});



export  const GetPropertyManager = async () => {
    const response = await axios.get(`${BASE_URL}/user/v1/property_manager`, {
        withCredentials: true
    })

    return response.data ?? [];
}


// -------------- Database - Postgres -------------- //

export const getBranchInfo = async () => {
    const response = await axios.get(`${BASE_URL}/branch/v1/name`, {
        withCredentials: true
    })

    return response.data;
}

export const getAllBranches = async () => {
    const response = await axios.get(`${BASE_URL}/branch/v1/all`, { withCredentials: true });
    return response.data ?? [];
}

export const getBranch = async (id: number) => {
    const response = await axios.get(`${BASE_URL}/branch/v1/${id}`, {
        withCredentials: true
    });

    return response.data;
}

export const getBranchPreview = async () => {
    // gets branch name, address and branch_image

    const response = await axios.get(`${BASE_URL}/branch/v1/preview`, {
        withCredentials: true
    });

    return response.data ?? [];
}

export const getBranchNameAddress = async () => {
    const response = await axios.get(`${BASE_URL}/branch/v1/preview/name-address`, {
        withCredentials: true
    });

    return response.data ?? [];
}

export const deleteBranch = async (id: number) => {
    const response = await axios.delete(`${BASE_URL}/branch/v1/${id}`, {
        withCredentials: true
    });

    return response.data;
}