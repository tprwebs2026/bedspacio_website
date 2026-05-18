import multer from 'multer';

const branchImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'file/branch/image');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

export const branchImage = multer({ 
    storage: branchImageStorage
});



const userImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'file/user');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

export const userImage = multer({
    storage: userImageStorage
})



const roomImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'file/room/image');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

export const roomImage = multer({
    storage: roomImageStorage
})