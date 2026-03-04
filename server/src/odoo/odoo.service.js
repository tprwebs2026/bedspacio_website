import { getOdooClient } from "./session.js";

export async function searchRead({
    model,
    domain = [],
    fields =[],
    limit = 20,
    offset = 0,
    order
}) {
    const odoo = await getOdooClient();

    const response = await odoo.call("/web/dataset/call_kw", {
        jsonrpc: "2.0",
        method: "call",
        params: {
            model,
            method: "search_read",
            args: [domain],
            kwargs: { fields, limit, offset, order },
        },
        id: Date.now(),
    });

    if (response.data?.error) throw new Error(JSON.stringify(response.data.error));
    return response.data.result;
}



export async function readByIds({ model, ids, fields = [] }) {
    const odoo = await getOdooClient();
    const response = await odoo.call("/web/dataset/call_kw", {
        jsonrpc: "2.0",
        method: "call", 
        params: {
            model,
            method: "read",
            args: [ids, fields],
            kwargs: {},
        },
        id: Date.now(),
    });

    if (response.data?.error) throw new Error(JSON.stringify(response.data.error));

    return response.data.result;
}