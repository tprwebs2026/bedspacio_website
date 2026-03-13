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
    const response = await axios.get<Branch[]>(`${BASE_URL}/branch/v1`, { withCredentials: true })
    return response.data ?? [];
})


export const getManagers = cache( async () => {
    const response = await axios.get(`${BASE_URL}/manager/v1`, { withCredentials: true });
    return response.data ?? [];
});