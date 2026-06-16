import pgPromise from 'pg-promise';
import pgSession from 'connect-pg-simple';
import { Pool } from 'pg';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';



const PostgreSession = connectPgSimple(session);
const pgp = new pgPromise();

export const db = pgp({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME
})

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME
})

export const sessionStore = new PostgreSession({
    pool,
    tableName: 'user_sessions'
});



export async function testConnection () {
    try {
        await db.one('SELECT 1');
        console.log('Connected to Postgres successfully!');

    } catch (err) {
        console.error('Error connecting to Postgres: ', err);
    }
}
