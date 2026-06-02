import axios from "axios";
import dotenv from 'dotenv';

dotenv.config({
    path: '.env.development'
});


const goHighLevelClient = axios.create({
    baseURL: process.env.GHL_API_BASE_URL,
    headers: {
        'Authorization': `Bearer ${process.env.GHL_PRIVATE_TOKEN}`,
        'Version': process.env.GHL_API_VERSION, 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000
})


export default goHighLevelClient;