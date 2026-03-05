import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config({ path: ".env.development" });

// Routes
import odooRoute from './src/routes/odoo.routes.js'; // test to get user session
import roomRoute from './src/routes/room.routes.js';
import branchRoute from './src/routes/branch.routes.js';
import managerRoute from './src/routes/manager.routes.js';

const app = express();

app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:3000'
    ],
    credentials: true
}));

app.use('/odoo', odooRoute);
app.use('/room', roomRoute);
app.use('/branch', branchRoute);
app.use('/manager', managerRoute);


app.get('/', (req, res) => {
    res.json({message: 'Hello world!'});
    // console.log('Hello World!');
})


app.listen(5000, () => {
    console.log('Server running in http://localhost:5000')
})
