import dotenv from "dotenv";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
dotenv.config();

const authenticateToken = async (
  req: Request,
  res: Response,
  next: () => void
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  // verify token 
  if (!process.env.ACCESS_TOKEN_SECRET) {
    console.error("ACCESS_TOKEN_SECRET is not defined");
    res.sendStatus(403);
    return;
  }

  try {
    await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (error) {
    res.sendStatus(403);
  }
};

export default authenticateToken;
