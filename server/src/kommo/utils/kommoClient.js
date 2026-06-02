
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({
    path: '.env.development'
})


const kommoClient = axios.create({
    baseURL: `https://${process.env.KOMMO_SUBDOMAIN}.kommo.com/api/v4`,
    headers: {
        'Authorization' : `Bearer ${process.env.KOMMO_ACCESS_TOKEN}`,
        'Content-Type' : `application/json`
    }
});

export default kommoClient;