import mongoose from "mongoose";
import validator from "validator";
import { iUser } from "../common/types";

const Schema = mongoose.Schema;

const UserSchema = new Schema<iUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Invalid email"],
  },
  password: {
    type: String,
    minLength: 10,
    required: true,
  },
  name: { type: String, minLength: 3, maxLength: 30 },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

export default mongoose.model("User", UserSchema);
