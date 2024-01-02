/**
 * This script populates production database with some dummy data. If database
 * does not exist, a new one is created.
 */

import dotenv from "dotenv";
import debug from "debug";
import mongoose from "mongoose";
import { createUsers, createPosts, createComments } from "./data";

dotenv.config();
const mongoDebug = debug("mongo");
const createUsersDebug = debug("createUsers");
const createPostsDebug = debug("createPosts");
const createCommentsDebug = debug("createComments");

mongoose.set("strictQuery", false);
main().catch((err) => mongoDebug(err));

async function main() {
  mongoDebug("About to connect");

  if (!process.env.MONGO_STRING) {
    mongoDebug("MONGO_STRING is missing from .env file");
    return;
  }

  await mongoose.connect(process.env.MONGO_STRING);
  mongoDebug("Connected");

  createUsersDebug("Creating users");
  await createUsers();
  createUsersDebug("Finished.");

  createPostsDebug("Creating posts");
  await createPosts();
  createPostsDebug("Finished");

  createCommentsDebug("Creating comments");
  await createComments();
  createCommentsDebug("Finished");

  mongoDebug("Closing mongoose");

  mongoose.connection.close();
}
