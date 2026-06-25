import dotenv from 'dotenv'
dotenv.config()

import pg from 'pg'

const {Pool} = pg

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'bankjs',
    port: 5432
})

export default pool

