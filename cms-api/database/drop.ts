/**
 * This script drops your database.
 */

import dotenv from "dotenv";
import debug from "debug";
import mongoose from "mongoose";

dotenv.config();
const mongoDebug = debug("mongo");

mongoose.set("strictQuery", false);
main().catch((err) => mongoDebug(err));

/**
 * Driver function.
 */
async function main() {
  mongoDebug("About to connect");

  if (!process.env.MONGO_STRING) {
    mongoDebug("MONGO_STRING is missing from .env file");
    return;
  }

  await mongoose.connect(process.env.MONGO_STRING);
  mongoDebug("Connected");

  await mongoose.connection.db.dropDatabase();
  mongoDebug("Dropped database");

  await mongoose.connection.close();
  mongoDebug("Closed connection");
}
