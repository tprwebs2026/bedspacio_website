import multer from 'multer';

const storage = multer.memoryStorage();

const imageUpload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            "image/jpeg",
            "image/png",
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error("Only JPG and PNG images are allowed.")
            );
        }
    },
});

export const branchImage = imageUpload;
export const userImage = imageUpload;
export const roomImage = imageUpload;

export const homeContentImage = imageUpload;
export const rentalContentImage = imageUpload;
export const aboutUsContentImage = imageUpload;
export const howItWorksContentImage = imageUpload;
export const contactContentImage = imageUpload;