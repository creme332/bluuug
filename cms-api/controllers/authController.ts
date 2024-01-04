/* eslint-disable @typescript-eslint/no-unused-vars */
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import User from "../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

// handle user login
export const login_post = [
  body("email").trim().escape().isEmail().withMessage("Invalid email"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .escape()
    .withMessage("Invalid password"),
  asyncHandler(async (req, res, next) => {
    // if errors present in data, send error array as a string
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: `${errors
          .array()
          .map((e) => e.msg)
          .join()}`,
      });

      return;
    }

    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json({ error: `User does not exist` });
      return;
    }

    // verify password
    const isValidPassword = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isValidPassword) {
      res.status(400).json({ error: "Incorrect password" });
      return;
    }

    // check if access token is properly defined
    if (!process.env.ACCESS_TOKEN_SECRET) {
      console.error("Server is missing access token");
      res.status(500).send({ error: "Server is missing access token" });
      return;
    }

    // return JWT to user
    const accessToken = jwt.sign(
      user.toJSON(),
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accessToken });
  }),
];
