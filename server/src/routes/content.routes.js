import express from 'express';
import { db } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import fs from 'fs/promises'
import path from 'path'

import { 
    homeContentImage, 
    rentalContentImage,
    aboutUsContentImage,
    howItWorksContentImage
} from '../middleware/multer.js';

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

// PUT REQUESTS 

contentRoute.put('/v1/home-banner',
    homeContentImage.single('hero_banner'),
    requireAuth,
    async (req, res) => {
        try {
            const image_file = req.file.filename;

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Image is required'
                });
            }

            // Get existing banner first
            const existingBanner = await db.oneOrNone(
                `
                SELECT asset_url
                FROM website_assets
                WHERE asset_key = $1
                `,
                ['homepage_hero_banner']
            );

            const banner = await db.one(
                `
                INSERT INTO website_assets (
                    asset_key,
                    asset_type,
                    asset_name,
                    asset_url
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4
                )
                ON CONFLICT (asset_key)
                DO UPDATE SET
                    asset_name = EXCLUDED.asset_name,
                    asset_url = EXCLUDED.asset_url,
                    updated_at = NOW()
                RETURNING *;
                `,
                [
                    'homepage_hero_banner',
                    'image',
                    'home_banner',
                    image_file
                ]
            );

            // Delete previous image if one existed
            if (
                existingBanner &&
                existingBanner.asset_url &&
                existingBanner.asset_url !== image_file
            ) {
                const oldFilePath = path.join(
                    process.cwd(),
                    'file/content/home',
                    existingBanner.asset_url
                );

                try {
                    await fs.unlink(oldFilePath);
                    console.log('Deleted old banner:', oldFilePath);
                } catch (deleteErr) {
                    console.error(
                        'Failed to delete old banner:',
                        deleteErr
                    );
                }
            }

            return res.status(200).json({
                success: true,
                banner
            });

        } catch (err) {
            console.log('Error uploading home banner image:', err);

            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
);


contentRoute.put('/v1/video_url', requireAuth, async (req, res) => {
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

        if (!match) {
            return res.status(400).json({
                success: false,
                message: 'Invalid YouTube URL'
            });
        }


        const embedLink = `https://www.youtube.com/embed/${match[1]}`;

        const videoDemo = await db.one(
            `
            INSERT INTO website_assets (
                asset_key,
                asset_type,
                asset_name,
                asset_url
            )
            VALUES (
                $1,
                $2,
                $3,
                $4
            )
            ON CONFLICT (asset_key)
            DO UPDATE SET
                asset_name = EXCLUDED.asset_name,
                asset_url = EXCLUDED.asset_url,
                updated_at = NOW()
            RETURNING *;
            `,
            [
                'homepage_video_demo',
                'youtube_video',
                youtube_title,
                embedLink
            ]
        );

        return res.status(200).json({
            success: true,
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
contentRoute.get('/v1/home-banner', async (req, res) => {
    try {
        const records = await db.oneOrNone(
            `SELECT 
                asset_name,
                asset_url
            FROM website_assets 
            WHERE 
                asset_key = 'homepage_hero_banner' AND
                asset_type = 'image'`
        )

        return res.status(200).json(records);

    } catch (err) {
        console.log('Error retreiving home banner image: ', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

contentRoute.get('/v1/video_url', async (req, res) => {
    try {
        const records = await db.oneOrNone(
            `SELECT 
                asset_name,
                asset_url,
                created_at,
                updated_at
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

// PUT REQUEST

contentRoute.put('/v1/rentals-banner',
    rentalContentImage.single('rental_hero_banner'),
    requireAuth,
    async (req, res) => {
        try {
            const image_file = req.file.filename;

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Image is required'
                });
            }

            // Get existing banner first
            const existingBanner = await db.oneOrNone(
                `
                SELECT asset_url
                FROM website_assets
                WHERE asset_key = $1
                `,
                ['rentalpage_hero_banner']
            );

            const banner = await db.one(
                `
                INSERT INTO website_assets (
                    asset_key,
                    asset_type,
                    asset_name,
                    asset_url
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4
                )
                ON CONFLICT (asset_key)
                DO UPDATE SET
                    asset_name = EXCLUDED.asset_name,
                    asset_url = EXCLUDED.asset_url,
                    updated_at = NOW()
                RETURNING *;
                `,
                [
                    'rentalpage_hero_banner',
                    'image',
                    'rental_banner',
                    image_file
                ]
            );

            // Delete previous image if one existed
            if (
                existingBanner &&
                existingBanner.asset_url &&
                existingBanner.asset_url !== image_file
            ) {
                const oldFilePath = path.join(
                    process.cwd(),
                    'file/content/rentals',
                    existingBanner.asset_url
                );

                try {
                    await fs.unlink(oldFilePath);
                    console.log('Deleted old banner:', oldFilePath);
                } catch (deleteErr) {
                    console.error(
                        'Failed to delete old banner:',
                        deleteErr
                    );
                }
            }

            return res.status(200).json({
                success: true,
                banner
            });

        } catch (err) {
            console.log('Error uploading rentals banner image:', err);

            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
);

// GET REQUESTS 

contentRoute.get(`/v1/rentals-banner`, async (req, res) => {
    try {

        const record = await db.oneOrNone(
            `SELECT 
                asset_name,
                asset_url
            FROM website_assets 
            WHERE 
                asset_key = 'rentalpage_hero_banner' AND
                asset_type = 'image'`
        );

        return res.status(200).json(record);

    } catch (err) {
        console.log('Error retreiving rental banner image: ', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})


// ------ ABOUT US ------ // 

// PUT REQUESTS 
contentRoute.put('/v1/about-us-banner',
    aboutUsContentImage.single('about_us_hero_banner'),
    requireAuth,
    async (req, res) => {
        try {
            const image_file = req.file.filename;

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Image is required'
                });
            }

            // Get existing banner first
            const existingBanner = await db.oneOrNone(
                `
                SELECT asset_url
                FROM website_assets
                WHERE asset_key = $1
                `,
                ['about_us_page_hero_banner']
            );

            const banner = await db.one(
                `
                INSERT INTO website_assets (
                    asset_key,
                    asset_type,
                    asset_name,
                    asset_url
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4
                )
                ON CONFLICT (asset_key)
                DO UPDATE SET
                    asset_name = EXCLUDED.asset_name,
                    asset_url = EXCLUDED.asset_url,
                    updated_at = NOW()
                RETURNING *;
                `,
                [
                    'about_us_page_hero_banner',
                    'image',
                    'about_us_banner',
                    image_file
                ]
            );

            // Delete previous image if one existed
            if (
                existingBanner &&
                existingBanner.asset_url &&
                existingBanner.asset_url !== image_file
            ) {
                const oldFilePath = path.join(
                    process.cwd(),
                    'file/content/about-us',
                    existingBanner.asset_url
                );

                try {
                    await fs.unlink(oldFilePath);
                    console.log('Deleted old banner:', oldFilePath);
                } catch (deleteErr) {
                    console.error(
                        'Failed to delete old banner:',
                        deleteErr
                    );
                }
            }

            return res.status(200).json({
                success: true,
                banner
            });

        } catch (err) {
            console.log('Error uploading about us banner image:', err);

            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
);

// GET REQUESTS 
contentRoute.get(`/v1/aboout-us-banner`, async (req, res) => {
    try {

        const record = await db.oneOrNone(
            `SELECT 
                asset_name,
                asset_url
            FROM website_assets 
            WHERE 
                asset_key = 'about_us_page_hero_banner' AND
                asset_type = 'image'`
        );

        return res.status(200).json(record);

    } catch (err) {
        console.log('Error retreiving rental banner image: ', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})


// ------ HOW IT WORKS ------ // 

// PUT REQUESTS 
contentRoute.put('/v1/how-it-works-banner',
    howItWorksContentImage.single('how_it_works_hero_banner'),
    requireAuth,
    async (req, res) => {
        try {
            const image_file = req.file.filename;

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Image is required'
                });
            }

            // Get existing banner first
            const existingBanner = await db.oneOrNone(
                `
                SELECT asset_url
                FROM website_assets
                WHERE asset_key = $1
                `,
                ['how_it_works_hero_banner']
            );

            const banner = await db.one(
                `
                INSERT INTO website_assets (
                    asset_key,
                    asset_type,
                    asset_name,
                    asset_url
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4
                )
                ON CONFLICT (asset_key)
                DO UPDATE SET
                    asset_name = EXCLUDED.asset_name,
                    asset_url = EXCLUDED.asset_url,
                    updated_at = NOW()
                RETURNING *;
                `,
                [
                    'how_it_works_hero_banner',
                    'image',
                    'how_it_works_banner',
                    image_file
                ]
            );

            // Delete previous image if one existed
            if (
                existingBanner &&
                existingBanner.asset_url &&
                existingBanner.asset_url !== image_file
            ) {
                const oldFilePath = path.join(
                    process.cwd(),
                    'file/content/how-it-works',
                    existingBanner.asset_url
                );

                try {
                    await fs.unlink(oldFilePath);
                    console.log('Deleted old banner:', oldFilePath);
                } catch (deleteErr) {
                    console.error(
                        'Failed to delete old banner:',
                        deleteErr
                    );
                }
            }

            return res.status(200).json({
                success: true,
                banner
            });

        } catch (err) {
            console.log('Error uploading about us banner image:', err);

            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
);



// GET REQUESTS 
contentRoute.get(`/v1/how-it-works-banner`, async (req, res) => {
    try {

        const record = await db.oneOrNone(
            `SELECT 
                asset_name,
                asset_url
            FROM website_assets 
            WHERE 
                asset_key = 'how_it_works_hero_banner' AND
                asset_type = 'image'`
        );

        return res.status(200).json(record);

    } catch (err) {
        console.log('Error retreiving rental banner image: ', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})




export default contentRoute;