import express from 'express';
import { db } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';

import { 
    homeContentImage, 
    rentalContentImage,
    aboutUsContentImage,
    howItWorksContentImage,
    contactContentImage,
} from '../middleware/multer.js';

// with cloudinary setup + multer
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { deleteFromCloudinary } from '../utils/deleteFromCloudinary.js';

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
            const image_file = req.file;

            console.log('Image File: ', image_file);

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Image is required'
                });
            }

            const uploadResult = await uploadToCloudinary(
                image_file,
                'bedspacio/content/home'
            );

            // get the url and public_id for the image in cloudinary
            const image_url = uploadResult.secure_url;
            const public_id = uploadResult.public_id;

            // Get existing banner first
            const existingBanner = await db.oneOrNone(
                `
                SELECT asset_public_id
                FROM website_assets
                WHERE asset_key = $1
                `,
                ['homepage_hero_banner']
            );

            if (existingBanner?.asset_public_id) {
                await deleteFromCloudinary(existingBanner.asset_public_id);
            }

            const banner = await db.one(
                `
                INSERT INTO website_assets (
                    asset_key,
                    asset_type,
                    asset_name,
                    asset_url,
                    asset_public_id
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5
                )
                ON CONFLICT (asset_key)
                DO UPDATE SET
                    asset_name = EXCLUDED.asset_name,
                    asset_url = EXCLUDED.asset_url,
                    asset_public_id = EXCLUDED.asset_public_id,
                    updated_at = NOW()
                RETURNING *;
                `,
                [
                    'homepage_hero_banner',
                    'image',
                    'home_banner',
                    image_url,
                    public_id
                ]
            );


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



contentRoute.put('/v1/room-type',
    homeContentImage.fields([
        { name: 'bedspace_image', maxCount: 1 },
        { name: 'apartment_image', maxCount: 1 }
    ]),  requireAuth, async (req, res) => {
    try {
        const bedspaceImage = req.files?.bedspace_image?.[0];
        const apartmentImage = req.files?.apartment_image?.[0];

        if (!bedspaceImage && !apartmentImage) {
            return res.status(400).json({
                success: false,
                message: 'At least one image is required'
            });
        }

        const existingAssets = await db.any(
            `
            SELECT 
                asset_key, 
                asset_url, 
                asset_public_id
            FROM website_assets
            WHERE asset_key IN (
                'room_type_bedspace',
                'room_type_apartment'
            )
            `
        );

        const existingMap = {};
        existingAssets.forEach(asset => {
            existingMap[asset.asset_key] = asset;
        });

        let bedspaceResult = null;
        let apartmentResult = null;

        if (bedspaceImage) {
            const old = existingMap['room_type_bedspace'];

            if (old?.asset_public_id) {
                await deleteFromCloudinary(old?.asset_public_id)
            }

            bedspaceResult = await uploadToCloudinary(
                bedspaceImage,
                'bedspacio/content/room-type'
            )

            await db.none(
                `
                INSERT INTO website_assets (
                    asset_key,
                    asset_type,
                    asset_name,
                    asset_url,
                    asset_public_id
                )
                VALUES (
                    'room_type_bedspace',
                    'image',
                    'bedspace_image',
                    $1,
                    $2
                )
                ON CONFLICT (asset_key)
                DO UPDATE SET
                    asset_url = EXCLUDED.asset_url,
                    asset_public_id = EXCLUDED.asset_public_id,
                    updated_at = NOW()
                `,
                [bedspaceResult.secure_url, bedspaceResult.public_id]
            );
        }

        if (apartmentImage) {
            const old = existingMap['room_type_apartment'];

            if (old?.asset_public_id) {
                await deleteFromCloudinary(old?.asset_public_id)
            }

            apartmentResult = await uploadToCloudinary(
                apartmentImage,
                'bedspacio/content/room-type'
            )

            await db.none(
                `
                INSERT INTO website_assets (
                    asset_key,
                    asset_type,
                    asset_name,
                    asset_url,
                    asset_public_id
                )
                VALUES (
                    'room_type_apartment',
                    'image',
                    'apartment_image',
                    $1,
                    $2
                )
                ON CONFLICT (asset_key)
                DO UPDATE SET
                    asset_url = EXCLUDED.asset_url,
                    asset_public_id = EXCLUDED.asset_public_id,
                    updated_at = NOW()
                `,
                [apartmentResult.secure_url, apartmentResult.public_id]
            );
        }
        
        const data = {};

        if (bedspaceResult) {
            data.bedspaceImage = bedspaceResult.secure_url;
        }

        if (apartmentResult) {
            data.apartmentImage = apartmentResult.secure_url;
        }

        console.log(data)
        return res.status(200).json({
            success: true,
            message: 'Room type images updated successfully',
            data
        });

    } catch (err) {
        console.log('Error uploading room type images: ', err);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
});





contentRoute.put('/v1/why-choose-us', homeContentImage.fields([
        { name: 'top_image', maxCount: 1 },
        { name: 'bottom_left', maxCount: 1 },
        { name: 'bottom_right', maxCount: 1 }
    ]), requireAuth, async (req, res) => {
    try {
        const topImage = req.files?.top_image?.[0];
        const bottomLeft = req.files?.bottom_left?.[0];
        const bottomRight = req.files?.bottom_right?.[0];

        if (!topImage && !bottomLeft && !bottomRight) {
            return res.status(400).json({
                success: false,
                message: 'At least one image is required'
            });
        }

        const existingAssets = await db.any(
            `
            SELECT 
                asset_key, 
                asset_url, 
                asset_public_id
            FROM website_assets
            WHERE asset_key IN (
                'why_choose_us_top',
                'why_choose_us_bottom_left',
                'why_choose_us_bottom_right'
            )
            `
        );

        const existingMap = {};

        existingAssets.forEach(asset => {
            existingMap[asset.asset_key] = asset;
        });

        let topImageResult = null;
        let bottomLeftResult = null;
        let bottomRightResult = null;
        
        if (topImage) {
            const old_image = existingMap['top_image'];
            if (old_image) {
                await deleteFromCloudinary(old_image?.asset_public_id)
            }

            topImageResult = await uploadToCloudinary(
                topImage,
                'bedspacio/content/home/why-choose-us'
            );

            await db.none(
                `
                INSERT INTO website_assets (
                    asset_key,
                    asset_type,
                    asset_name,
                    asset_url,
                    asset_public_id
                )
                VALUES (
                    'why_choose_us_top',
                    'image',
                    'top_image',
                    $1,
                    $2
                )
                ON CONFLICT (asset_key)
                DO UPDATE SET
                    asset_url = EXCLUDED.asset_url,
                    asset_public_id = EXCLUDED.asset_public_id,
                    updated_at = NOW()
                `,
                [ topImageResult.secure_url, topImageResult.public_id ]
            );
        }

        if (bottomLeft) {
            const old_image = existingMap['bottom_left'];
            if (old_image) {
                await deleteFromCloudinary(old_image?.asset_public_id)
            }

            bottomLeftResult = await uploadToCloudinary(
                bottomLeft,
                'bedspacio/content/home/why-choose-us'
            );

            await db.none(
                `
                INSERT INTO website_assets (
                    asset_key,
                    asset_type,
                    asset_name,
                    asset_url,
                    asset_public_id
                )
                VALUES (
                    'why_choose_us_bottom_left',
                    'image',
                    'bottom_left',
                    $1,
                    $2
                )
                ON CONFLICT (asset_key)
                DO UPDATE SET
                    asset_url = EXCLUDED.asset_url,
                    asset_public_id = EXCLUDED.asset_public_id,
                    updated_at = NOW()
                `,
                [ bottomLeftResult.secure_url, bottomLeftResult.public_id ]
            );
        }

        if (bottomRight) {
            const old_image = existingMap['bottom_left'];
            if (old_image) {
                await deleteFromCloudinary(old_image?.asset_public_id)
            }

            bottomRightResult = await uploadToCloudinary(
                bottomRight,
                'bedspacio/content/home/why-choose-us'
            );

            await db.none(
                `
                INSERT INTO website_assets (
                    asset_key,
                    asset_type,
                    asset_name,
                    asset_url,
                    asset_public_id
                )
                VALUES (
                    'why_choose_us_bottom_right',
                    'image',
                    'bottom_right',
                    $1,
                    $2
                )
                ON CONFLICT (asset_key)
                DO UPDATE SET
                    asset_url = EXCLUDED.asset_url,
                    asset_public_id = EXCLUDED.asset_public_id,
                    updated_at = NOW()
                `,
                [ bottomRightResult.secure_url, bottomRightResult.public_id ]
            );
        }

        const data = {};

        if (topImage) {
            data.topImage = topImageResult.secure_url;
        };

        if (bottomLeft) {
            data.bottomLeft = bottomLeftResult.secure_url;
        };

        if (bottomRight) {
            data.bottomRight = bottomRightResult.secure_url;
        };

        return res.status(200).json({
            success: true,
            message: 'Room type images updated successfully',
            data
        });
    } catch (err) {
        console.log('Error uploading why choose us images: ', err);
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
        const record = await db.oneOrNone(
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

        return res.status(200).json(record);

    } catch (err) {
        console.log('Error retreiving video url: ', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})


contentRoute.get('/v1/room-type/bedspace_image', async (req, res) => {
    try {
        const record = await db.oneOrNone(
            `SELECT 
                asset_name,
                asset_url,
                created_at,
                updated_at
            FROM website_assets 
            WHERE 
                asset_key = 'room_type_bedspace' AND
                asset_type = 'image'`
        )

        return res.status(200).json(record);

    } catch (err) {
        console.log('Error retreiving home banner image: ', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
});


contentRoute.get('/v1/room-type/apartment_image', async (req, res) => {
    try {
        const record = await db.oneOrNone(
            `SELECT 
                asset_name,
                asset_url,
                created_at,
                updated_at
            FROM website_assets 
            WHERE 
                asset_key = 'room_type_apartment' AND
                asset_type = 'image'`
        )

        return res.status(200).json(record);

    } catch (err) {
        console.log('Error retreiving home banner image: ', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})


contentRoute.get('/v1/why-choose-us', async (req, res) => {
    try {
        const records = await db.manyOrNone(
            `SELECT
                asset_key,
                asset_url,
                created_at,
                updated_at
            FROM website_assets
            WHERE asset_key IN (
                'why_choose_us_top',
                'why_choose_us_bottom_left',
                'why_choose_us_bottom_right'
            )`
        );

        return res.status(200).json(records);
    } catch (err) {
        console.log('Error retreiving why choose us images: ', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
});



// ------ RENTALS ------ //

// PUT REQUEST

contentRoute.put('/v1/rentals-banner',
    rentalContentImage.single('rental_hero_banner'),
    requireAuth,
    async (req, res) => {
        try {
            const image_file = req.file;

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Image is required'
                });
            }

            const uploadResult = await uploadToCloudinary(
                image_file,
                'bedspacio/content/rentals'
            );

            // get the url and public_id for the image in cloudinary
            const image_url = uploadResult.secure_url;
            const public_id = uploadResult.public_id;

            // Get existing banner first
            const existingBanner = await db.oneOrNone(
                `
                SELECT asset_public_id
                FROM website_assets
                WHERE asset_key = $1
                `,
                ['rentalpage_hero_banner']
            );

            if (existingBanner?.asset_public_id) {
                await deleteFromCloudinary(existingBanner.asset_public_id);
            }

            const banner = await db.one(
                `
                INSERT INTO website_assets (
                    asset_key,
                    asset_type,
                    asset_name,
                    asset_url,
                    asset_public_id
                )
                VALUES (
                    'rentalpage_hero_banner',
                    'image',
                    'rental_banner',
                    $1,
                    $2
                )
                ON CONFLICT (asset_key)
                DO UPDATE SET
                    asset_name = EXCLUDED.asset_name,
                    asset_url = EXCLUDED.asset_url,
                    asset_public_id = EXCLUDED.asset_public_id,
                    updated_at = NOW()
                RETURNING *;
                `,
                [ image_url, public_id ]
            );

            console.log(
                {
                    success: true,
                    banner
                }
            )

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
            const image_file = req.file;

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Image is required'
                });
            }

            const uploadResult = await uploadToCloudinary(
                image_file,
                'bedspacio/content/about-us'
            );

            const image_url = uploadResult.secure_url;
            const public_id = uploadResult.public_id;

            // Get existing banner first
            const existingBanner = await db.oneOrNone(
                `
                SELECT asset_public_id
                FROM website_assets
                WHERE asset_key = $1
                `,
                ['about_us_page_hero_banner']
            );

            if (existingBanner?.asset_public_id) {
                await deleteFromCloudinary(existingBanner.asset_public_id);
            }

            const banner = await db.one(
                `
                INSERT INTO website_assets (
                    asset_key,
                    asset_type,
                    asset_name,
                    asset_url,
                    asset_public_id
                )
                VALUES (
                    'about_us_page_hero_banner',
                    'image',
                    'about_us_banner',
                    $1,
                    $2
                )
                ON CONFLICT (asset_key)
                DO UPDATE SET
                    asset_name = EXCLUDED.asset_name,
                    asset_url = EXCLUDED.asset_url,
                    asset_public_id = EXCLUDED.asset_public_id,
                    updated_at = NOW()
                RETURNING *;
                `,
                [ image_url, public_id ]
            );

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


contentRoute.put('/v1/about-us/who-we-are',
    aboutUsContentImage.single('who_we_are_image'),
    requireAuth,
    async (req, res) => {
        try {
            const image_file = req.file;

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Image is required'
                });
            };

            const uploadResult = await uploadToCloudinary(
                image_file,
                'bedspacio/content/about-us'
            );

            const image_url = uploadResult.secure_url;
            const public_id = uploadResult.public_id;

            // Get existing banner first
            const existingImage = await db.oneOrNone(
                `
                SELECT asset_public_id
                FROM website_assets
                WHERE asset_key = $1
                `,
                ['aboutus_who_we_are']
            );

            if (existingImage?.asset_public_id) {
                await deleteFromCloudinary(
                    existingImage?.asset_public_id
                )
            };

            const image = await db.one(
                `
                INSERT INTO website_assets (
                    asset_key,
                    asset_type,
                    asset_name,
                    asset_url,
                    asset_public_id
                )
                VALUES (
                    'aboutus_who_we_are',
                    'image',
                    'who_we_are_image',
                    $1,
                    $2
                )
                ON CONFLICT (asset_key)
                DO UPDATE SET
                    asset_name = EXCLUDED.asset_name,
                    asset_url = EXCLUDED.asset_url,
                    asset_public_id = EXCLUDED.asset_public_id,
                    updated_at = NOW()
                RETURNING *;
                `,
                [ image_url, public_id ]
            );

            console.log({
                success: true,
                image
            });

            return res.status(200).json({
                success: true,
                image
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


contentRoute.put('/v1/about-us/history',
    aboutUsContentImage.single('history_image'),
    requireAuth,
    async (req, res) => {
        try {
            const image_file = req.file;

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Image is required'
                });
            }

            const uploadResult = await uploadToCloudinary(
                image_file,
                'bedspacio/content/about-us'
            );

            const image_url = uploadResult.secure_url;
            const public_id = uploadResult.public_id;

            // Get existing banner first
            const existingImage = await db.oneOrNone(
                `
                SELECT asset_public_id
                FROM website_assets
                WHERE asset_key = $1
                `,
                ['aboutus_history']
            );

            if (existingImage?.asset_public_id) {
                await deleteFromCloudinary(
                    existingImage.asset_public_id
                )
            };

            const image = await db.one(
                `
                INSERT INTO website_assets (
                    asset_key,
                    asset_type,
                    asset_name,
                    asset_url,
                    asset_public_id
                )
                VALUES (
                    'aboutus_history',
                    'image',
                    'history_image',
                    $1,
                    $2
                )
                ON CONFLICT (asset_key)
                DO UPDATE SET
                    asset_name = EXCLUDED.asset_name,
                    asset_url = EXCLUDED.asset_url,
                    asset_public_id = EXCLUDED.asset_public_id,
                    updated_at = NOW()
                RETURNING *;
                `,
                [ image_url, public_id ]
            );


            return res.status(200).json({
                success: true,
                image
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
});

contentRoute.get(`/v1/aboout-us/who-we-are`, async (req, res) => {
    try {
        const record = await db.oneOrNone(
            `SELECT 
                asset_name,
                asset_url
            FROM website_assets 
            WHERE 
                asset_key = 'aboutus_who_we_are' AND
                asset_type = 'image'`
        );

        return res.status(200).json(record);

    } catch (err) {
        console.log('Error retreiving who we are image: ', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
});


contentRoute.get(`/v1/aboout-us/history`, async (req, res) => {
    try {
        const record = await db.oneOrNone(
            `SELECT 
                asset_name,
                asset_url
            FROM website_assets 
            WHERE 
                asset_key = 'aboutus_history' AND
                asset_type = 'image'`
        );

        return res.status(200).json(record);

    } catch (err) {
        console.log('Error retreiving history image: ', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
});


// ------ HOW IT WORKS ------ // 

// PUT REQUESTS 
contentRoute.put('/v1/how-it-works-banner',
    howItWorksContentImage.single('how_it_works_hero_banner'),
    requireAuth,
    async (req, res) => {
        try {
            const image_file = req.file;

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Image is required'
                });
            }

            const uploadResult = await uploadToCloudinary(
                image_file,
                'bedspacio/content/how-it-works'
            );

            const image_url = uploadResult.secure_url;
            const public_id = uploadResult.public_id;

            // Get existing banner first
            const existingBanner = await db.oneOrNone(
                `
                SELECT asset_public_id
                FROM website_assets
                WHERE asset_key = $1
                `,
                ['how_it_works_hero_banner']
            );

            if (existingBanner?.asset_public_id) {
                await deleteFromCloudinary(
                    existingBanner.asset_public_id
                )
            };

            const banner = await db.one(
                `
                INSERT INTO website_assets (
                    asset_key,
                    asset_type,
                    asset_name,
                    asset_url,
                    asset_public_id
                )
                VALUES (
                    'how_it_works_hero_banner',
                    'image',
                    'how_it_works_banner',
                    $1,
                    $2
                )
                ON CONFLICT (asset_key)
                DO UPDATE SET
                    asset_name = EXCLUDED.asset_name,
                    asset_url = EXCLUDED.asset_url,
                    asset_public_id = EXCLUDED.asset_public_id,
                    updated_at = NOW()
                RETURNING *;
                `,
                [ image_url, public_id ]
            );

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



// CONTACTS

// PUT REQUEST
contentRoute.put('/v1/contacts',
    contactContentImage.single('contacts_image'),
    requireAuth,
    async (req, res) => {
        try {
            const image_file = req.file;

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Image is required'
                });
            }

            const uploadResult = await uploadToCloudinary(
                image_file,
                'bedspacio/content/contacts'
            );

            const image_url = uploadResult.secure_url;
            const public_id = uploadResult.public_id;

            // Get existing banner first
            const existingImage = await db.oneOrNone(
                `
                SELECT asset_public_id
                FROM website_assets
                WHERE asset_key = $1
                `,
                ['contacts_image_promo']
            );

            if (existingImage?.asset_public_id) {
                await deleteFromCloudinary(
                    existingImage.asset_public_id
                )
            };

            const image = await db.one(
                `
                INSERT INTO website_assets (
                    asset_key,
                    asset_type,
                    asset_name,
                    asset_url,
                    asset_public_id
                )
                VALUES (
                    'contacts_image_promo',
                    'image',
                    'contacts_image',
                    $1,
                    $2
                )
                ON CONFLICT (asset_key)
                DO UPDATE SET
                    asset_name = EXCLUDED.asset_name,
                    asset_url = EXCLUDED.asset_url,
                    asset_public_id = EXCLUDED.asset_public_id,
                    updated_at = NOW()
                RETURNING *;
                `,
                [ image_url, public_id ]
            );

            return res.status(200).json({
                success: true,
                image
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
contentRoute.get(`/v1/contacts`, async (req, res) => {
    try {

        const record = await db.oneOrNone(
            `SELECT 
                asset_name,
                asset_url
            FROM website_assets 
            WHERE 
                asset_key = 'contacts_image_promo' AND
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