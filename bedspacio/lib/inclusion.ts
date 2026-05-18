import { cache } from "react"
import axios from 'axios'
import { BASE_URL } from "@/config/config";


export const createInclusion = async (value: string) => {
    const response = await axios.post(`${BASE_URL}/inclusion/v1/new`, {inclusion: value}, {
        withCredentials: true
    });

    return response.data;
} 

export const getInclusions = async () => {
    const response = await axios.get(`${BASE_URL}/inclusion/v1/all`, {
        withCredentials: true
    });

    return response.data ?? [];
}


export const deleteInclusion = async (id: number) => {
    const response = await axios.delete(`${BASE_URL}/inclusion/v1/${id}`, {
        withCredentials: true
    });

    return response.data;
}

export const updateInclusion = async (id: number, value: string) => {
    const response = await axios.patch(`${BASE_URL}/inclusion/v1/${id}`, { inclusion: value }, {
        withCredentials: true
    });

    return response.data;
}