/* eslint-disable @typescript-eslint/no-unused-vars */
import User from "../models/user";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

const userProjection = { __v: 0, password: 0 };

const emailChain = () =>
  body("email").trim().escape().isEmail().withMessage("Invalid email.");

const uniqueEmailChain = () =>
  emailChain().custom(async (email) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("A user already exists with this e-mail address");
    }
    return true;
  });

export const user_list = asyncHandler(async (req, res, next) => {
  try {
    const users = await User.find({}, userProjection);
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

export const user_detail = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id, userProjection);
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

// Handle user create on POST.
export const user_create_post = [
  // Validate and sanitize fields.
  uniqueEmailChain(),
  body("password")
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage("Password must have at least 5 characters."),
  body("name")
    .trim()
    .isLength({ min: 3, max: 30 })
    .escape()
    .withMessage("Name must have 3-30 characters."),
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

    // Create object with escaped and trimmed data
    const userDict = {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
    };

    const item = new User(userDict);

    // Data from form is valid. Save item.
    try {
      await item.save();
      res.status(200).send();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }),
];

// Handle User delete on POST.
export const user_delete_post = asyncHandler(async (req, res, next) => {
  //! add user authentication

  const user = User.findById(req.params.id);

  // check if item exists
  if (!user) {
    res.status(400).json({ error: "User does not exist" });
    return;
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});
