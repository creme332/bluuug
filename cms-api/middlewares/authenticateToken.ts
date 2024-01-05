import dotenv from "dotenv";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

dotenv.config();

function parseJwt(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

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

    const deserializedToken = parseJwt(token);

    // pass user document to next middleware
    const user = await User.findById(deserializedToken.id);
    res.locals.user = user;
    next();
  } catch (error) {
    res.sendStatus(403);
  }
};

export default authenticateToken;
