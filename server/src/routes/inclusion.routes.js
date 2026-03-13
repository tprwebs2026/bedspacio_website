import express from 'express';
import { searchRead } from '../odoo/odoo.service.js';
import { readByIds } from '../odoo/odoo.service.js';

const inclusionRoute = express.Router();

inclusionRoute.get('/v1', async (req, res, next) => {
    try {
        const inclusions = await searchRead({
            model: "bedspacio.room.inclusion",
            domain: [],
            fields: [ "name" ],
            limit: 20,
            offset: 0,
            order: "id asc"
        });

        res.json(inclusions.map(
            inc => ({
                id: inc.id,
                name:inc.name
            })
        )) ?? [];
    } catch (err) {
        next(err);
    }
});



export default inclusionRoute;