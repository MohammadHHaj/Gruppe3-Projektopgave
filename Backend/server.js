import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';


dotenv.config();
console.log('Connecting to database', process.env.PG_DATABASE);
const db = new pg.Pool({
    host:     process.env.PG_HOST,
    port:     parseInt(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    user:     process.env.PG_USER,
    password: process.env.PG_PASSWORD,
});

const dbResult = await db.query('select now() as now');
console.log('Database connection established on', dbResult.rows[0].now);

const server = express();
const port = 3000;


server.use(express.static('Forside'));



server.use((request, response, next) => {
    console.log(new Date(), request.method, request.url);
    next();
}); 

server.get('/api/allAlbums', onGetAllAlbums);

server.listen(port, onServerReady);


function onServerReady() {
    console.log('Webserver running on port', port);
    
}

async function onGetAllAlbums(request,response) {
    const dbResult = await db.query('select * from albums');
    response.send(dbResult.rows); 
}









