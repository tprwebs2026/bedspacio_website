import axios from 'axios';
import { BASE_URL } from '@/config/config';


export const logout = async () => {
    await axios.post(`${BASE_URL}/user-setup/v1/logout`, {}, {
        withCredentials: true
    });
}