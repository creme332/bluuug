/* eslint-disable @typescript-eslint/no-unused-vars */
import User from "../models/user";
import asyncHandler from "express-async-handler";

const userProjection = { __v: 0, password: 0 };

export const user_list = asyncHandler(async (req, res, next) => {
  const users = await User.find({}, userProjection);
  res.json(users);
});

export const user_detail = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id, userProjection).exec();
  res.json(user);
});
