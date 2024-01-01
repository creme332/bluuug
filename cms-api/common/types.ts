import { Types, SortOrder } from "mongoose";

export interface iUser {
  name: string;
  email: string;
  password: string;
  comments: Types.ObjectId[];
  posts: Types.ObjectId[];
}

export interface iComment {
  text: string;
  timestamp: Date;
  post: Types.ObjectId;
  author: Types.ObjectId;
}

export interface iPost {
  title: string;
  summary: string;
  tags: string[];
  body: string;
  category: string;
  timestamp: Date;
  comments: Types.ObjectId[];
  author: Types.ObjectId;
}

// Define a type for the sorting criteria object
export type SortingCriteria = { [key: string]: SortOrder };
