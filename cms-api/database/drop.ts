/**
 * This script drops your database.
 */

import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

mongoose.set("strictQuery", false);
main().catch((err) => console.log(err));

/**
 * Driver function.
 */
async function main() {
  console.log("About to connect");

  if (!process.env.MONGO_STRING) {
    console.log("MONGO_STRING is missing from .env file");
    return;
  }

  await mongoose.connect(process.env.MONGO_STRING);
  console.log("Connected");

  await mongoose.connection.db.dropDatabase();
  console.log("Dropped database");

  await mongoose.connection.close();
  console.log("Closed connection");
}
