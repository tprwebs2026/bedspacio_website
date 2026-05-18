import express from 'express';
import { db } from '../config/database.js';
import { searchRead } from '../odoo/odoo.service.js';
import { readByIds } from '../odoo/odoo.service.js';
import { requireAuth } from '../middleware/auth.js';

const inclusionRoute = express.Router();

inclusionRoute.get('/v1', async (req, res, next) => {
    try {
        const inclusions = await searchRead({
            model: "bedspacio.room.inclusion",
            domain: [],
            fields: [ "name", "slug" ],
            limit: 20,
            offset: 0,
            order: "id asc"
        });

        res.json(inclusions.map(
            inc => ({
                id: inc.id,
                name:inc.name,
                slug: inc.slug
            })
        )) ?? [];
    } catch (err) {
        next(err);
    }
});


// FROM DATABASE

inclusionRoute.post('/v1/new', requireAuth, async (req, res) => {
    try {
        let { inclusion } = req.body;

        if (!inclusion) {
            return res.status(400).json({
                success: false,
                message: 'Inclusion is required'
            });
        }

        inclusion = inclusion.trim();

        const slug = inclusion
            .toLowerCase()                    
            .trim()
            .replace(/\s+/g, '-')             
            .replace(/-+/g, '-')              
            .replace(/^-|-$/g, '');           

        if (!slug) {
            return res.status(400).json({
                success: false,
                message: 'Invalid inclusion name - cannot generate valid slug'
            });
        }

        const response = await db.oneOrNone(
            `INSERT INTO inclusions (inclusion, slug) 
            VALUES ($1, $2) RETURNING id`,
            [inclusion, slug]
        );

        return res.status(200).json({
            success: true,
            message: 'Successfully created inclusion',
            data: response.id
        });

    } catch (err) {
        console.error('Error creating inclusion: ', err);

        if (err.code === '23505') {  // PostgreSQL unique violation
            return res.status(409).json({
                success: false,
                message: 'Inclusion or slug already exists'
            });
        }

        return res.status(500).send({
            success: false,
            message: 'Internal server error'
        })
    }
});

inclusionRoute.get('/v1/all', async (req, res) => {
    try {   
        const response = await db.manyOrNone(
            `SELECT * FROM inclusions ORDER BY id ASC`
        );

        if (response.length < 0) {
            return res.status(404).send({
                message: 'No data found'
            })
        }
        
        return res.json(response);

    } catch (err) {
        console.error('Error retrieving inclusions: ', err);
    }
})

inclusionRoute.delete('/v1/:id', requireAuth, async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id) {
            return res.send({
                success: false,
                message: 'Id is required'
            })
        } 

        const response = await db.one(
            `DELETE FROM inclusions WHERE id = $1 
            RETURNING inclusion`,
            [id]
        );

        return res.status(200).send({
            success: true,
            message: `Inclusion ${response.inclusion} deleted successfully`,
            inclusion: response.inclusion
        })
        

    } catch (err) {
        console.error('Error deleting inclusion: ', err);
        return res.status(500).send({
            message: 'Internal server error'
        })
    }
})

inclusionRoute.patch('/v1/:id', requireAuth, async (req, res) => {
    try {
        const { inclusion } = req.body;
        const id = Number(req.params.id);

        if (!id) {
            return res.status(401).send({
                success: false,
                message: 'Id required'
            });
        };

        const response = await db.oneOrNone(
            `UPDATE inclusions
            SET inclusion = $1
            WHERE id = $2`,
            [ inclusion, id ]
        );

        return res.status(200).send({
            success: true,
            message: 'Updated inclusion successfully',
            updatedInclusion: inclusion 
        })


    } catch (err) {
        console.error('Error updating inclusion: ', err);
    }
})

export default inclusionRoute;