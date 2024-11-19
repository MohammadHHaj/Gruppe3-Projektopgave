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
DROP TABLE IF EXISTS telephones;
DROP TABLE IF EXISTS electricity;

CREATE TABLE internet_acces(
country varchar(30),
year integer check(year >=1990 and year <= 2022),
internet_usage float default 0.0 check(internet_usage >= 0 and internet_usage <= 100),
primary key(country,year)
);

CREATE TABLE telephones(
	country varChar(30),
	year integer check(year >=1990 and year <= 2022),
	telephones_per_100 float not null check(telephones_per_100 >= 0),
	PRIMARY KEY (country,year)
);

CREATE TABLE electricity(
 country varChar(30),
  year integer check(year >=1990 and year <= 2022),
	electricity_access_percentage float not null check(electricity_access_percentage >= 0),
	PRIMARY KEY (country,year)
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

await copyIntoTable(
  db,
  `
	COPY telephones(country,year,telephones_per_100)
  FROM stdin
  WITH CSV HEADER`,
  "data/telephones.csv"
);

await copyIntoTable(
  db,
  `
	COPY electricity(country,year,electricity_access_percentage)
  FROM stdin
  WITH CSV HEADER`,
  "data/electricity.csv"
);

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
