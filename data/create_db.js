import pg from "pg";
import dotenv from "dotenv";
import { pipeline } from "node:stream/promises";
import fs from "node:fs";
import { from as copyFrom } from "pg-copy-streams";
//Henter dotenv
dotenv.config();
console.log("Connecting to database", process.env.PG_DATABASE);
const db = new pg.Pool({
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT),
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  ssl: process.env.PG_REQUIRE_SSL
    ? {
        rejectUnauthorized: false,
      }
    : undefined,
});
const dbResult = await db.query("select now()");
console.log("Database connection established on", dbResult.rows[0].now);

console.log("Recreating tables...");
await db.query(`
DROP TABLE IF EXISTS internet_acces;
DROP TABLE IF EXISTS countries_temp;

CREATE TABLE internet_acces(
country varchar(30),
year integer,
internet_usage float default 0.0,
primary key(country,year)
);

CREATE TEMPORARY TABLE countries_temp(
country_id serial PRIMARY KEY,
country_name varChar(30) not null unique
);

`);
console.log("Tables recreated.");

console.log("Copying data from CSV files...");
await copyIntoTable(
  db,
  `
	COPY internet_acces (country,year,internet_usage)
    FROM stdin
    WITH CSV HEADER`,
  "data/internet.csv"
);

await db.query(`
    INSERT INTO countries_temp(country_name) 
    SELECT DISTINCT country
    FROM internet_acces
    ORDER BY country;
    `);

await db.end();
console.log("Data copied.");

async function copyIntoTable(db, sql, file) {
  const client = await db.connect();
  try {
    const ingestStream = client.query(copyFrom(sql));
    const sourceStream = fs.createReadStream(file);
    await pipeline(sourceStream, ingestStream);
  } finally {
    client.release();
  }
}
