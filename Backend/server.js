import express from "express";
import pg from "pg";
import dotenv from "dotenv";

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

const port = process.env.PORT || 3000;
const server = express();

server.use(express.static("frontend"));
server.use(onEachRequest);
server.get("/api/internet_usage", onGetData);
server.get("/api/telephones_100", onGetTelephones);
server.get("/api/electricity_percentage", onGetElectricity);
server.get("/api/onGetCountry", onGetCountry);
server.get("/api/internet_data", onGetInternetData);
server.get("/api/telephones_data", onGetTelephonesData);
server.get("/api/electricity_data", onGetElectricityData);
server.listen(port, onServerReady);

async function onGetData(request, response) {
  const year = request.query.year; // Sørger for at få årstallet fra query-parameteren
  console.log(`${year} årstal hentet`);

  if (!year) {
    return response.status(400).send("Year parameter is required");
  }

  try {
    const dbResult = await db.query(
      `
            SELECT country,
                   year,
                   COALESCE(internet_usage, 0.0) AS internet_usage
            FROM internet_acces
            WHERE year = $1
            ORDER BY country ASC
            `,
      [year]
    ); // Passer årstallet som parameter til SQL-forespørgslen

    response.json(dbResult.rows); // Sender resultatet tilbage som JSON
  } catch (error) {
    console.error("Database query failed:", error);
    response.status(500).send("Internal server error");
  }
}

//Ny function som henter alt data fra telephones og udvælger dataen.
async function onGetTelephones(request, response) {
  const year = request.query.year; // Sørger for at få årstallet fra query-parameteren
  console.log(`${year} årstal hentet`);

  if (!year) {
    return response.status(400).send("Year parameter is required");
  }

  try {
    const dbResult = await db.query(
      `
            SELECT country,
                year,
                telephones_per_100
            FROM telephones
            WHERE year = $1
            ORDER BY country ASC
            `,
      [year]
    ); // Passer årstallet som parameter til SQL-forespørgslen

    response.json(dbResult.rows); // Sender resultatet tilbage som JSON
  } catch (error) {
    console.error("Database query failed:", error);
    response.status(500).send("Internal server error");
  }
}

//Ny function som henter alt data fra electricity og udvælger dataen.
async function onGetElectricity(request, response) {
  const year = request.query.year; // Sørger for at få årstallet fra query-parameteren
  console.log(`${year} årstal hentet`);

  if (!year) {
    return response.status(400).send("Year parameter is required");
  }

  try {
    const dbResult = await db.query(
      `
              SELECT country,
                  year,
                  electricity_access_percentage
              FROM electricity
              WHERE year = $1
              ORDER BY country ASC
              `,
      [year]
    ); // Passer årstallet som parameter til SQL-forespørgslen

    response.json(dbResult.rows); // Sender resultatet tilbage som JSON
  } catch (error) {
    console.error("Database query failed:", error);
    response.status(500).send("Internal server error");
  }
}

async function onGetCountry(request, response) {
  const countryQuery = request.query.country || "";
  console.log(`Søger efter lande der matcher: ${countryQuery}`);

  try {
    const dbResult = await db.query(
      `
      SELECT DISTINCT country 
      FROM internet_acces
      WHERE LOWER(country) LIKE LOWER($1)
      ORDER BY country ASC
      `,
      [`%${countryQuery}%`]
    );

    response.json(dbResult.rows);
  } catch (error) {
    console.error("Database query failed:", error);
    response.status(500).send("Internal server error");
  }
}
// New API for fetching internet data for a specific country
async function onGetInternetData(request, response) {
  const country = request.query.country;
  try {
    const dbResult = await db.query(
      `SELECT year, internet_usage FROM internet_acces WHERE country = $1 ORDER BY year ASC`,
      [country]
    );
    response.json(dbResult.rows);
  } catch (error) {
    console.error("Database query failed:", error);
    response.status(500).send("Internal server error");
  }
}
// New API for fetching telephones data for a specific country
async function onGetTelephonesData(request, response) {
  const country = request.query.country;
  try {
    const dbResult = await db.query(
      `SELECT year, telephones_per_100 FROM telephones WHERE country = $1 ORDER BY year ASC`,
      [country]
    );
    response.json(dbResult.rows);
  } catch (error) {
    console.error("Database query failed:", error);
    response.status(500).send("Internal server error");
  }
}

// New API for fetching electricity data for a specific country
async function onGetElectricityData(request, response) {
  const country = request.query.country;
  try {
    const dbResult = await db.query(
      `SELECT year, electricity_access_percentage FROM electricity WHERE country = $1 ORDER BY year ASC`,
      [country]
    );
    response.json(dbResult.rows);
  } catch (error) {
    console.error("Database query failed:", error);
    response.status(500).send("Internal server error");
  }
}

function onEachRequest(request, response, next) {
  console.log(new Date(), request.method, request.url);
  next();
}

function onServerReady() {
  console.log("Webserver running on port", port);
}
