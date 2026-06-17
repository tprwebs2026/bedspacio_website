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



// Content images
const homeImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'file/content/home');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

export const homeContentImage = multer({
    storage: homeImageStorage
})



const rentalImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'file/content/rentals');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

export const rentalContentImage = multer({
    storage: rentalImageStorage
})


const aboutusImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'file/content/about-us');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

export const aboutUsContentImage = multer({
    storage: aboutusImageStorage
})



const howItWorksImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'file/content/how-it-works');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

export const howItWorksContentImage = multer({
    storage: howItWorksImageStorage
})



// ------------ FOR RENDER ------------- //
/*
    Use this when deployed
*/
