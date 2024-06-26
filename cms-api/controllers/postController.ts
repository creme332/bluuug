/* eslint-disable @typescript-eslint/no-unused-vars */
import Post from "../models/post";
import User from "../models/user";
import asyncHandler from "express-async-handler";
import { Request } from "express";
import { SortingCriteria } from "../common/types";
import { SortOrder } from "mongoose";
import { body, validationResult } from "express-validator";
import authenticateToken from "../middlewares/authenticateToken";
import authenticateAdmin from "../middlewares/authenticateAdmin";

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
  const sortType = getSort(req);
  try {
    const posts = await Post.find({}, postProjection).sort(sortType);
    res.json(posts);
  } catch (error) {
    res.status(404).json({ error: "Posts not found." });
  }
});

export const post_categories_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Post.distinct("category");
  res.json(allCategories);
});

export const post_tag_list = asyncHandler(async (req, res, next) => {
  const allTags = await Post.aggregate([
    // get only array of tags for each document
    {
      $project: { _id: 0, tags: 1 },
    },

    // explode array
    {
      $unwind: "$tags",
    },
    {
      // get unique tags
      $group: {
        _id: null,
        uniqueValues: { $addToSet: "$tags" },
      },
    },
  ]);
  res.json(allTags[0].uniqueValues);
});

export const post_detail = asyncHandler(async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id, postProjection);
    res.json(post);
  } catch (error) {
    res.status(404).json({ error: "Post not found." });
  }
});

// Handle Post create on POST.
export const post_create_post = [
  authenticateToken,
  authenticateAdmin,
  body("title")
    .trim()
    .isLength({ min: 5 })
    .escape()
    .withMessage("Title must have at least 5 characters."),
  body("summary")
    .trim()
    .isLength({ min: 5 })
    .escape()
    .withMessage("Summary must have at least 5 characters."),
  body("body")
    .trim()
    .isLength({ min: 5 })
    .escape()
    .withMessage("Body must have at least 5 characters."),
  body("category")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Category must have at least 1 characters."),
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // if errors present, send error array as a string
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: `${errors
          .array()
          .map((e) => e.msg)
          .join()}`,
      });

      return;
    }

    // set author to currently authenticated user
    const author = res.locals.user;

    // check if author is valid
    if (!author) {
      res.status(400).json({ error: `Author does not exist` });
      return;
    }

    // Create Post object with escaped and trimmed data
    const postDict = {
      title: req.body.title,
      body: req.body.body,
      summary: req.body.summary,
      tags: req.body.tags,
      category: req.body.category,
      timestamp: new Date(),
      author: author.id,
    };

    const item = new Post(postDict);

    // Data from form is valid. Save item.
    try {
      await item.save();
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }),
];

// Handle Post delete on POST.
export const post_delete_post = [
  authenticateToken,
  authenticateAdmin,
  asyncHandler(async (req, res, next) => {
    const post = Post.findById(req.params.id);

    // check if item exists
    if (!post) {
      res.status(400).json({ error: "Post does not exist" });
      return;
    }

    try {
      await Post.findByIdAndDelete(req.params.id);
      res.send();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }),
];
