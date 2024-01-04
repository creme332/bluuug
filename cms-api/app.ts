import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import postRouter from "./routes/posts";
import commentRouter from "./routes/comments";
import userRouter from "./routes/users";
import authRouter from "./routes/auth";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/v1/posts", postRouter);
app.use("/v1/comments", commentRouter);
app.use("/v1/users", userRouter);
app.use("/v1/auth", authRouter);

export default app;
