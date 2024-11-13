import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
console.log('Connecting to database', process.env.PG_DATABASE);
const db = new pg.Pool({
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: process.env.PG_REQUIRE_SSL ? {
        rejectUnauthorized: false,
    } : undefined,
});
const dbResult = await db.query('select now()');
console.log('Database connection established on', dbResult.rows[0].now);

const port = process.env.PORT || 3000;
const server = express();

server.use(express.static('frontend'));
server.use(onEachRequest);
server.get("/api/internet_usage", onGetData);
server.listen(port, onServerReady);

// async function onGetData(request, response) {
//     const query = request.query;
//     const year = query.start;
//     console.log(year + "årstal hentet");
    
//     const dbResult = await db.query(`
//         SELECT country,
//         year,
//         COALESCE(internet_usage,0.0) AS internet_usage
//         FROM internet_acces
//         WHERE YEAR = $1
//         ORDER BY country ASC
//         `)
// };
async function onGetData(request, response) {
    const year = request.query.year;  // Sørg for at få årstallet fra query-parameteren
    console.log(`${year} årstal hentet`);

    if (!year) {
        return response.status(400).send('Year parameter is required');
    }

    try {
        const dbResult = await db.query(`
            SELECT country,
                   year,
                   COALESCE(internet_usage, 0.0) AS internet_usage
            FROM internet_acces
            WHERE year = $1
            ORDER BY country ASC
        `, [year]);  // Passer årstallet som parameter til SQL-forespørgslen

        response.json(dbResult.rows);  // Sender resultatet tilbage som JSON
    } catch (error) {
        console.error('Database query failed:', error);
        response.status(500).send('Internal server error');
    }
}


function onEachRequest(request, response, next) {
    console.log(new Date(), request.method, request.url);
    next();
}

function onServerReady() {
    console.log('Webserver running on port', port);
}
