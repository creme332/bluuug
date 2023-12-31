import mongoose from "mongoose";
import { iPost } from "../common/types";

const Schema = mongoose.Schema;

const PostSchema = new Schema<iPost>({
  title: {
    type: String,
    required: true,
    minLength: 5,
  },
  summary: {
    type: String,
    minLength: 5,
    maxLength: 400,
  },
  tags: [
    {
      type: String,
      minLength: 1,
    },
  ],
  body: {
    type: String,
    required: true,
    minLength: 5,
  },
  category: {
    type: String,
    required: true,
    minLength: 1,
  },
  timestamp: { type: Date, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

export default mongoose.model("Post", PostSchema);
