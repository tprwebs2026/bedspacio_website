import express from 'express';
import axios from 'axios';

const odooRoute = express.Router();

odooRoute.get("/ping", async (req, res, next) => {
    try {
        const odoo = axios.create({ 
            baseURL: process.env.ODOO_URL,
            validateStatus: () => true, // so we can see non-200 bodies too
            maxRedirects: 0, 
        });

        const r = await odoo.post("/web/session/authenticate", {
            jsonrpc: "2.0",
            method: "call",
            params: {
                db: process.env.ODOO_DB,
                login: process.env.ODOO_USERNAME,
                password: process.env.ODOO_PASSWORD
            },
            id: Date.now(),
        }, {
            headers: { "Content-Type": "application/json" }
        });

        if (r.data?.error) {
            return res.status(401).json({
                ok: false,
                status: r.status,
                odoo_error: r.data.error,
                headers: r.headers,
            });
        }

        const uid = r.data?.result?.uid;
        if (!uid) {
            return res.status(401).json({
                ok: false,
                status: r.status,
                message: "Authentication failed (uid is falsy). Check DB/login/password(API key).",
                result: r.data?.result,
                headers: r.headers,
            });
        }

        const setCookie = r.headers?.["set-cookie"];
        // if(!setCookie) throw new Error("No session cookie returned!");


        console.log(r.data)
        return res.json({
            ok: true,
            status: r.status,
            uid,
            username: r.data?.result?.username,
            db: r.data?.result?.db,
            hasCookie: Boolean(setCookie?.length),
            setCookiePreview: setCookie?.[0]?.split(";")?.[0] ?? null, // just the name=value
        })

    } catch (err) {
        next(err);
    }
})

export default odooRoute;