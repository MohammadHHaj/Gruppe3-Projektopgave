import express from "express";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const db = new pg.Pool({
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT),
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

const port = process.env.PORT || 3000;
const server = express();

server.use(express.static("frontend"));
server.use(onEachRequest);
server.get("/api/internet_usage", onGetData);
server.listen(port, onServerReady);

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
      [year]
    );

    console.log("Database query result:", dbResult.rows);
    response.send(dbResult.rows);
  } catch (error) {
    console.error("Database error:", error);
    response.status(500).send({ error: "Database error" });
  }
}

function onEachRequest(request, response, next) {
  console.log(new Date(), request.method, request.url);
  next();
}

function onServerReady() {
  console.log("Webserver running on port", port);
}
