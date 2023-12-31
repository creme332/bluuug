import mongoose from "mongoose";
import { iComment } from "../common/types";
const Schema = mongoose.Schema;

const CommentSchema = new Schema<iComment>({
  text: {
    type: String,
    required: true,
    minLength: 5,
  },
  timestamp: { type: Date, required: true },
  post: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
  author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

export default mongoose.model("Comment", CommentSchema);
