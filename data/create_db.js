import express from "express";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

// Opretter forbindelse til databasen med miljøvariablerne
const db = new pg.Pool({
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT), // Sørger for at porten bliver behandlet som et tal
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false, // Brug SSL, men ignorer advarsler om usignerede certifikater
  },
});

const port = process.env.PORT || 3000;
const server = express();

server.use(express.static("frontend")); // Gør frontend-filer tilgængelige
server.use(onEachRequest); // Logger hver anmodning
server.get("/api/internet_usage", onGetData); // Håndterer GET anmodninger for data
server.listen(port, onServerReady); // Starter serveren

// Funktion til at hente data for et bestemt år
async function onGetData(request, response) {
  const { year } = request.query;
  console.log(`Fetching data for year: ${year}`);

  try {
    const dbResult = await db.query(
      `
        SELECT
          country,
          year,
          COALESCE(internet_usage, 0.0) AS internet_usage
        FROM internet_acces
        WHERE year = $1
        ORDER BY country ASC
      `,
      [year] // Parameteriseret query for at forhindre SQL-injektion
    );

    console.log("Database query result:", dbResult.rows);
    response.send(dbResult.rows);
  } catch (error) {
    console.error("Database error:", error);
    response.status(500).send({ error: "Database error" });
  }
}

// Middleware til at logge hver anmodning
function onEachRequest(request, response, next) {
  console.log(new Date(), request.method, request.url);
  next();
}

// Funktion der køres når serveren er klar
function onServerReady() {
  console.log("Webserver running on port", port);
}

// ------------------------------------------------------------------------------------------------------

// Dette er scriptet til at importere data fra CSV og oprette tabeller
import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import { from as copyFrom } from "pg-copy-streams";

dotenv.config();

async function main() {
  console.log("Connecting to database", process.env.PG_DATABASE);

  const db = new pg.Pool({
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: process.env.PG_REQUIRE_SSL ? { rejectUnauthorized: false } : undefined, // SSL kun hvis aktiveret
  });

  try {
    const dbResult = await db.query("SELECT NOW()");
    console.log("Database connection established on", dbResult.rows[0].now);

    console.log("Recreating tables...");
    await db.query(`
      DROP TABLE IF EXISTS internet_acces;
      CREATE TABLE internet_acces(
        country VARCHAR(30),
        year INTEGER,
        internet_usage FLOAT DEFAULT 0.0,
        PRIMARY KEY(country, year)
      );
    `);
    console.log("Tables recreated.");

    console.log("Copying data from CSV files...");
    await copyIntoTable(
      db,
      `
        COPY internet_acces (country, year, internet_usage)
        FROM stdin
        WITH csv HEADER
      `,
      "data/internet_usage.csv" // Ændre stien, hvis nødvendigt
    );

    await db.query(`
      UPDATE internet_acces
      SET internet_usage = 0.0
      WHERE internet_usage IS NULL OR internet_usage = 0;
    `);
    console.log("Data copied and updated.");

    const sampleData = await db.query("SELECT * FROM internet_acces LIMIT 10");
    console.log("Sample data from 'internet_acces' table:", sampleData.rows);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await db.end();
    console.log("Database connection closed.");
  }
}

// Funktion til at importere data fra CSV til database
async function copyIntoTable(db, sql, file) {
  const client = await db.connect();
  try {
    if (!fs.existsSync(file)) {
      // Tjekker om CSV-filen findes
      console.error("CSV file not found:", file);
      return;
    }
    console.log("Starting CSV import for file:", file);
    const ingestStream = client.query(copyFrom(sql));
    const sourceStream = fs.createReadStream(file);
    await pipeline(sourceStream, ingestStream);
    console.log("Data imported successfully from CSV.");
  } catch (error) {
    console.error("Error copying data:", error);
  } finally {
    client.release(); // Husk at frigive klientforbindelsen
  }
}

main();
