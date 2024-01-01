/* eslint-disable @typescript-eslint/no-unused-vars */
import Post from "../models/post";
import asyncHandler from "express-async-handler";
import { Request } from "express";
import { SortingCriteria } from "../common/types";
import { SortOrder } from "mongoose";

const postProjection = { __v: 0 };

function getSort(req: Request): SortingCriteria {
  const { sort, order } = req.query;

  if (!sort) {
    return {};
  }

  const orderIndex: SortOrder = order == "desc" ? -1 : 1;

  if (sort == "date") {
    return { timestamp: orderIndex };
  }

  if (sort == "title") {
    return { title: orderIndex };
  }

  return {};
}

export const post_list = asyncHandler(async (req, res, next) => {
  console.log(req.query);
  const sortType = getSort(req);
  try {
    const posts = await Post.find({}, postProjection).sort(sortType);
    res.json(posts);
  } catch (error) {
    res.status(404).json({ error: "Posts not found." });
  }
});

export const post_detail = asyncHandler(async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id, postProjection);
    res.json(post);
  } catch (error) {
    res.status(404).json({ error: "Post not found." });
  }
});
