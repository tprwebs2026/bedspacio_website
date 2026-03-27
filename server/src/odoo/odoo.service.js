import { getOdooClient } from "./session.js";

const USER_API_KEY = process.env.USER_API_KEY;

export async function searchRead({
    model,
    domain = [],
    fields =[],
    limit = 20,
    offset = 0,
    order
}) {
    const odoo = await getOdooClient();

    const payload = {
        domain,
        fields,
        limit,
        offset
    }

    if (order) payload.order = order;

    const response = await odoo.call(`/json/2/${model}/search_read`, payload);


    console.log('SearchRead Response: ', response.data)
    return response.data;
}



export async function readByIds({ 
    model, 
    ids, 
    fields = [] 
}) {
    const odoo = await getOdooClient();

    const response = await odoo.call(`/json/2/${model}/read`, {
        ids, 
        fields
    });

    if (response.data?.error) throw new Error(JSON.stringify(response.data.error));
    return response.data;
}





export async function executeKw({
    model, 
    method,
    kwargs = {}
}) {
    const odoo = await getOdooClient();


    const response = await odoo.call(`/json/2/${model}/${method}`, { ...kwargs });

    if (response?.data?.error) {
        throw new Error(JSON.stringify(response.data.error))
    };

    console.log("executeKw response:", response.data);

    return response.data;
};



// Create a lead for Inquiry (first activity)
// CRM

export async function createInquiryRecord({
    model,
    values,
}) {
    try {
        const odoo = await getOdooClient();

        const path = `/json/2/${model}/create`;
        const body = {
            vals_list: [
                { values }
            ]
        }

        console.log('Inquiry body: ', body)

        const result = await odoo.call(path, body);


        console.log('Inquiry Record: ', result.data);
        return result.data || result;

    } catch (err) {
        console.error('Create Record failed: ', err);
        throw err;
    }
};