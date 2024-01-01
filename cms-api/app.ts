import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import postRouter from "./routes/posts";
import commentRouter from "./routes/comments";
import userRouter from "./routes/users";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Set up mongoose connection
mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));
async function main() {
  if (!process.env.MONGO_STRING) {
    console.error("Invalid mongo string");
    return;
  }
  await mongoose.connect(process.env.MONGO_STRING);
}

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/v1/posts", postRouter);
app.use("/v1/comments", commentRouter);
app.use("/v1/users", userRouter);

export default app;
