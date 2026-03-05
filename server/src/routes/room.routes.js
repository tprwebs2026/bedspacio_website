import express from 'express';
import { searchRead } from '../odoo/odoo.service.js';
import { readByIds } from '../odoo/odoo.service.js';

const roomRoute = express.Router();

/*
    THIS ROUTE WILL BE USED TO RETRIEVE INFORMATION ABOUT:
    > room listings
    > room in-depth information
    > room images
*/


roomRoute.get('/listing' , async (req, res, next) => {
    try {
        const domain = [];

        const rooms = await searchRead({
            model: "bedspacio.room",
            domain,
            fields: [ 
                "room_name", "room_type", "gender", "starting_price", "is_available",'description', 'image_ids', "branch_id", "inclusion_ids" 
            ],
            limit: 20,
            offset: Number(req.query.offset || 0),
            order: "id desc"
        });

        const inclusionIds = [...new Set(
            rooms
                .flatMap(room => room.inclusion_ids || [])
            )];

        const inclusions = inclusionIds.length
            ? await readByIds({
                model: "bedspacio.room.inclusion",
                ids: inclusionIds,
                fields: ["name"]
            })
            : [];
        const inclusionMap = Object.fromEntries(inclusions.map(inc => [inc.id, inc]));

        
        const imageIds = [...new Set(
            rooms
                .map(room => room.image_ids?.[0]) // take the first image [index 0]
                .filter((id) => typeof id === "number")
            )];
        const thumbs = imageIds.length
            ? await readByIds({
                model: "bedspacio.room.image",
                ids: imageIds,
                fields: ["image"]
            })
            : [];
        
        const thumbMap = Object.fromEntries(thumbs.map(thumb => [thumb.id, thumb]))

        res.json(
            rooms.map((room) => {
                const thumbId = room.image_ids?.[0];
                const thumbRecord = typeof thumbId === "number" ? thumbMap[thumbId] : null;

                return {
                    id: room.id,
                    room_name: room.room_name,
                    room_type: room.room_type,
                    gender: room.gender,
                    price: room.starting_price,
                    is_available: room.is_available,
                    branch_id: room.branch_id,
                    inclusions: (room.inclusion_ids || [])
                        .map(id => inclusionMap[id])
                        .filter(Boolean),

                    thumbnail: thumbRecord?.image ?? null,
                    thumbnail_image_id: thumbId ?? null
                }
            })
        );
        
    } catch (err) {
        next(err);
    }
});

export default roomRoute;