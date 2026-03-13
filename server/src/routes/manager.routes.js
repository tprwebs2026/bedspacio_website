import express from 'express';
import { searchRead } from '../odoo/odoo.service.js';
import { readByIds } from '../odoo/odoo.service.js';


const managerRoute = express.Router();

/*
    THIS ROUTE WILL BE USED TO RETRIEVE INFORMATION ABOUT:
    > property manager details
*/

managerRoute.get('/v1', async (req, res, next) => {
    try {
        const domain = [];

        const propertyManager = await searchRead({
            model: "bedspacio.property.manager",
            domain,
            fields: [
                "name", 
                "profile_image",
                "contact_number",
                "branch_id"
            ],
            limit: 10,
            offset: Number(req.query.offset || 0),
            order: "id asc"
        });

        if (!propertyManager) throw new Error('Failed to retrieve data fro Property Manager!');

        res.json(
            propertyManager.map(pm => ({
                id: pm.id,
                name: pm.name,
                profile_image: pm.profile_image,
                contact_number: pm.contact_number,
                branch: {
                    id: pm.branch_id?.[0],
                    branch_name: pm.branch_id?.[1]
                }
            }))
        );
    } catch (err) {
        next(err);
    }
})




export default managerRoute;