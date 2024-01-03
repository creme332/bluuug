/**
 * This script populates production database with some dummy data. If database
 * does not exist, a new one is created.
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import dataManager from "./data";

dotenv.config();

mongoose.set("strictQuery", false);
main().catch((err) => console.log(err));

async function main() {
  console.log("About to connect");

  if (!process.env.MONGO_STRING) {
    console.log("MONGO_STRING is missing from .env file");
    return;
  }

  await mongoose.connect(process.env.MONGO_STRING);
  console.log("Connected");
  dataManager().save();

  console.log("Closing mongoose");

  mongoose.connection.close();
}
