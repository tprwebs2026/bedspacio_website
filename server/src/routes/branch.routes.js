import express from 'express';
import { searchRead } from '../odoo/odoo.service.js';
import { readByIds } from '../odoo/odoo.service.js';

const branchRoute = express.Router();

/*
    THIS ROUTE WILL BE USED TO RETRIEVE INFORMATION ABOUT:
    > branch details
    > landmark details
*/


branchRoute.get('/v1', async (req, res, next) => {
    try {
        const domain = [];

        const branches = await searchRead({
            model: "bedspacio.branch",
            domain,
            fields: [
                "branch_name", 
                "branch_image",
                "address"
            ],
            limit: 20,
            offset: Number(req.query.offset || 0),
            order: "id asc"
        });

        res.json(
            branches.map(branch => ({
                id: branch.id,
                name: branch.branch_name,
                branch_image: branch.branch_image,
                address:branch.address
            }))
        )

    } catch (err) {
        next(err);
    }
})



export default branchRoute;