/* eslint-disable @typescript-eslint/no-unused-vars */
import Comment from "../models/comment";
import asyncHandler from "express-async-handler";
import { Request } from "express";
import { SortingCriteria } from "../common/types";
import { SortOrder } from "mongoose";
import { body, validationResult } from "express-validator";
import Post from "../models/post";
import User from "../models/user";

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

function getFilter(req: Request) {
  const { user, post } = req.query;

  if (!user && !post) return {};

  if (!user && post) return { post };
  if (user && !post) return { author: user };

  //! Add sanitization
  return { author: user, post };
}

export const comment_list = asyncHandler(async (req, res, next) => {
  try {
    const posts = await Comment.find(getFilter(req), commentProjection).sort(
      getSort(req)
    );
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

// Handle user create on POST.
export const comment_create_post = [
  body("text")
    .trim()
    .isLength({ min: 5 })
    .escape()
    .withMessage("Text must have at least 5 characters."),
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
    // check if post is valid
    const post = Post.findById(req.body.post);
    if (!post) {
      res.status(400).json({ error: "Post does not exist." });
      return;
    }

    // check if user is valid
    const user = User.findById(req.body.author);
    if (!user) {
      res.status(400).json({ error: "User does not exist." });
      return;
    }

    // Create object with escaped and trimmed data
    const commentDict = {
      text: req.body.text,
      timestamp: new Date(),
      post: req.body.post,
      author: req.body.author,
    };

    const item = new Comment(commentDict);

    // Data from form is valid. Save item.
    try {
      await item.save();
      res.send();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }),
];

// Handle Comment delete on POST.
export const comment_delete_post = asyncHandler(async (req, res, next) => {
  //! add user authentication

  const comment = Comment.findById(req.params.id);

  // check if item exists
  if (!comment) {
    res.status(400).json({ error: "Comment does not exist" });
    return;
  }

  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});
