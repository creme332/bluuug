/* eslint-disable @typescript-eslint/no-unused-vars */
import Comment from "../models/comment";
import asyncHandler from "express-async-handler";
import { Request } from "express";
import { SortingCriteria } from "../common/types";
import { SortOrder } from "mongoose";

const commentProjection = { __v: 0 };

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

export const comment_list = asyncHandler(async (req, res, next) => {
  console.log(req.query);
  const sortType = getSort(req);
  try {
    const posts = await Comment.find({}, commentProjection).sort(sortType);
    res.json(posts);
  } catch (error) {
    res.status(404).json({ error: "Comments not found." });
  }
});

export const comment_detail = asyncHandler(async (req, res, next) => {
  try {
    const post = await Comment.findById(req.params.id, commentProjection);
    res.json(post);
  } catch (error) {
    res.status(404).json({ error: "Comment not found." });
  }
});
