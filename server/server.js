import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from "dotenv";



dotenv.config({ path: ".env.development" });


// config for Postgres
import { testConnection } from './src/config/database.js';
import { sessionStore } from './src/config/database.js';

// Routes
import odooRoute from './src/routes/odoo.routes.js'; // test to get user session
import roomRoute from './src/routes/room.routes.js';
import branchRoute from './src/routes/branch.routes.js';
import managerRoute from './src/routes/manager.routes.js';
import inclusionRoute from './src/routes/inclusion.routes.js';
import inquiryRoutes from './src/routes/inquiry.routes.js';


// used for postgres
import userRoute from './src/routes/user.routes.js';
import userSetupRoute from './src/routes/user.setup.routes.js';


const app = express();

app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:3000'
    ],
    credentials: true
}));
// app.set('trust proxy', true); // uncomment later when deployed

// used for postres
// file uploads for branch image, room image, and profile image
app.use('/file', express.static('file'));

// used for postgres
app.use(
    session({
        name: 'bedspacio_session',
        secret: process.env.SESSION_SECRET,
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            secure: false, // Change to production later --> process.env.NODE_ENV === 'production',
            httpOnly: true, // change to false when working on production
            sameSite: 'lax'
        }
    })
);



// used by Postgres only
app.use('/user-setup', userSetupRoute) 
app.use('/user', userRoute);

// both Odoo and Postgres used this routes
app.use('/odoo', odooRoute);
app.use('/room', roomRoute);
app.use('/branch', branchRoute);
app.use('/manager', managerRoute);
app.use('/inclusion', inclusionRoute);
app.use('/inquiry', inquiryRoutes);


app.get('/', (req, res) => {
    res.json({message: 'Hello world!'});
})


app.listen(5000, () => {
    console.log('Server running in http://localhost:5000')
    testConnection();
})
