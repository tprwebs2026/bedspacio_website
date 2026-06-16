import express from 'express';
import { db } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import fs from 'fs/promises'
import path from 'path'

import { homeContentImage } from '../middleware/multer.js';

const contentRoute = express.Router();

// TABLE MAP

/*
    > asset_key
    > asset_type
    > asset_name
    > asset_url
    > created_at
    > updated_at
*/


// ------ HOME ------ //

// PATCH REQUESTS 
contentRoute.post('/v1/home-banner', homeContentImage.single('hero_banner'), requireAuth, async (req, res) => {
    try {

    } catch (err) {
        console.log('Error uploading home banner image: ', err);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
});


contentRoute.patch('/v1/video_url', requireAuth, async (req, res) => {
    try {
        const { youtube_title, youtube_url } = req.body;

        if (!youtube_title || !youtube_url) { 
            return res.status(401).json({
                success: false,
                message: 'Title and URL is required'
            })
        };

        const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/;
        const match = youtube_url.match(regExp);
        const embedLink = `https://www.youtube.com/embed/${match[1]}`;

        const videoDemo = await db.oneOrNone(
            `INSERT INTO website_assets (
                asset_key,
                asset_type,
                asset_name,
                asset_url
            ) VALUES (
                $1, $2, $3, $4
            ) RETURNING *`, [
                'homepage_video_demo',
                'youtube_video',
                youtube_title,
                embedLink
            ]
        );

        return res.status(200).json({
            success: false,
            data: videoDemo
        });

    } catch (err) {
        console.log('Error uploading video URL: ', err);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
});



contentRoute.post('/v1/room-type',
    homeContentImage.array([
        { name: 'bedspace_image', count: 1 },
        { name: 'apartment_image', count: 1 }
    ]),  requireAuth, async (req, res) => {
    try {

    } catch (err) {
        console.log('Error uploading video URL: ', err);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
});


contentRoute.post('/v1/why-choose-us', homeContentImage.array([
        { name: 'top_image', count: 1 },
        { name: 'bottom_left', count: 1 },
        { name: 'bottom_right', count: 1 }
    ]), requireAuth, async (req, res) => {
    try {



    } catch (err) {
        console.log('Error uploading video URL: ', err);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
});


// GET REQUESTS 
contentRoute.get('/v1/video_url', async (req, res) => {
    try {
        const records = await db.oneOrNone(
            `SELECT 
                asset_name,
                asset_url
            FROM website_assets 
            WHERE 
                asset_key = 'homepage_video_demo' AND
                asset_type = 'youtube_video'`
        )

        return res.status(200).json(records);

    } catch (err) {
        console.log('Error retreiving video url: ', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})



// ------ RENTALS ------ //

// POST REQUESTS 
// PATCH REQUESTS 
// GET REQUESTS 



// ------ ABOUT US ------ // 

// POST REQUESTS 
// PATCH REQUESTS 
// GET REQUESTS 



// ------ HOW IT WORKS ------ // 

// POST REQUESTS 
// PATCH REQUESTS 
// GET REQUESTS 




export default contentRoute;