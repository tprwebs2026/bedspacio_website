import cloudinary from "../config/cloudinary.js";


export const deleteFromCloudinary = async (public_id) => {
    try {
        const result = await cloudinary.uploader.destroy(public_id, {
            resource_type: 'image'
        });

        console.log('Cloudinary delete result: ', result);
        return result;
    } catch (err) {
        console.log('Cloudinary delete failed: ', err);
    }
}