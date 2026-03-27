import axios from 'axios';
import dotenv from 'dotenv';

// dotenv.config({ path: '.env.development' })
dotenv.config({ path: '.env' })



const baseURL = process.env.ODOO_URL;

// async function login() {
//     const client = axios.create({ baseURL, validateStatus: () => true });

//     const response = await client.post("/web/session/authenticate", {
//         jsonrpc: "2.0",
//         method: "call",
//         params: {
//             db: process.env.ODOO_DB,
//             login: process.env.ODOO_USERNAME,
//             password: process.env.ODOO_PASSWORD
//         },
//         id: Date.now(),
//     });

//     if (response?.data?.error) throw new Error(`Odoo auth error: ${JSON.stringify(response.data.error)}`);

//     const uid = response.data?.result?.uid;
//     if (!uid) throw new Error("Odoo auth failed: uid falsy");

//     const setCookie = response.headers?.["set-cookie"];
//     if (!setCookie.length) throw new Error("Odoo auth succeeded but no Set-Cookie returned");

//     // Keep only session cookie (Odoo uses session_id)
//     const sessionCookie = setCookie.find(cookie => cookie.startsWith("session_id=")) || setCookie[0];
//     cookieJar = sessionCookie.split(";")[0]; // "session_id=xxxxx"

//     return { uid };
// };


// export async function getOdooClient() {
//     if (!cookieJar) await login();

//     const client = axios.create({
//         baseURL,
//         headers: { Cookie: cookieJar },
//         validateStatus: () => true
//     });

//     return {
//         call: async (path, body) => {
//             let response = await client.post(path, body);

//             if (response.status === 403 || response.data?.error?.message?.toLowerCase()?.includes("session")) {
//                 cookieJar = null;
//                 await login();
//                 const retryClient = axios.create({
//                     baseURL,
//                     headers: { Cookie: cookieJar },
//                     validateStatus: () => true
//                 });

//                 response = await retryClient.post(path,body)
//             }

//             return response;
//         }
//     };
// }


export async function getOdooClient() {
    const client = axios.create({
        baseURL,
        headers: {
            Authorization: `Bearer ${process.env.USER_API_KEY}`,
            "Content-Type": "application/json",
            "X-Odoo-Database": process.env.ODOO_DB
        },
        validateStatus: () => true
    });

    return {
        call: async (path, body) => {
            const response = await client.post(path, body);

            if (response.data?.error) {
                throw new Error(
                    `Odoo API error : ${JSON.stringify(response.data.error)}`
                )
            }

            return response;
        }
    }
}

