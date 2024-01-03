import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";
import { HydratedDocument } from "mongoose";
import { iUser, iPost, iComment } from "../common/types";

dotenv.config();

/**
 * Uploads sample data to database. An existing active mongo connection is required.
 */
function dataManager() {
  const users: HydratedDocument<iUser>[] = [];
  const posts: HydratedDocument<iPost>[] = [];

  async function save() {
    console.log(`Creating users...`);
    await createUsers();
    console.log(`Creating posts...`);
    await createPosts();
    console.log(`Creating comments...`);
    await createComments();
    console.log(`Done.`);
  }

  async function createUsers() {
    await Promise.all([
      createUser("creme332@bluuug.com", "creme332", "sample_password"),
      createUser("test_user@bluuug.com", "test_user", "test_password"),
      createUser("harrykane12@bluuug.com", "harry kane", "aaaaaaaa"),
    ]);
  }

  /**
   * Saves data for a new user in database
   * @param {String} email User email
   * @param {String} name Username
   * @param {String} password Password of user
   */
  async function createUser(email: string, name: string, password: string) {
    if (!process.env.SALT_ROUNDS) {
      console.log("SALT_ROUNDS is not defined in .env");
      return;
    }

    const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user: HydratedDocument<iUser> = new User({
      email,
      name,
      password: hashedPassword,
    });
    await user.save();
    users.push(user);
  }

  async function createComments() {
    try {
      await createComment("Comment 1 for Post 1", users[0], posts[0]);
      await createComment("Comment 2 for Post 1", users[1], posts[0]);
      await createComment("Comment 1 for Post 2", users[1], posts[1]);
      await createComment("Comment 2 for Post 2", users[0], posts[1]);
    } catch (error) {
      console.log("Error creating comments:", error);
    }
  }

  async function createPosts() {
    // HTML bodies for posts
    const post1Body = `
    <h2>Introduction to HTML</h2>
    <p>This is an introduction to HTML. HTML stands for HyperText Markup Language...</p>
    <!-- More content -->
  `;

    const post2Body = `
    <h2>CSS Basics</h2>
    <p>Learn the basics of CSS (Cascading Style Sheets) to style your web pages...</p>
    <!-- More content -->
  `;

    const post3Body = `
    <h2>JavaScript Fundamentals</h2>
    <p>Understanding the core concepts of JavaScript programming language...</p>
    <!-- More content -->
  `;

    try {
      await createPost(
        "Introduction to HTML",
        post1Body,
        "HTML basics",
        "Web Development",
        ["HTML", "Basics"],
        users[0]
      );

      await createPost(
        "CSS Basics",
        post2Body,
        "CSS fundamentals",
        "Web Design",
        ["CSS", "Styling"],
        users[0]
      );

      await createPost(
        "JavaScript Fundamentals",
        post3Body,
        "JavaScript basics",
        "Programming",
        ["JavaScript", "Basics"],
        users[0]
      );
    } catch (error) {
      console.log("Error creating posts:", error);
    }
  }

  async function createComment(
    text: string,
    author: HydratedDocument<iUser>,
    post: HydratedDocument<iPost>
  ) {
    const comment: HydratedDocument<iComment> = new Comment({
      text,
      author,
      post,
      timestamp: new Date(),
    });
    await comment.save();

    author.comments.push(comment.id);
    await author.save();

    post.comments.push(comment.id);
    await post.save();
  }

  async function createPost(
    title: string,
    body: string,
    summary: string,
    category: string,
    tags: string[],
    author: HydratedDocument<iUser>
  ) {
    const post: HydratedDocument<iPost> = new Post({
      title,
      body,
      summary,
      category,
      tags,
      timestamp: new Date(),
      author,
    });

    await post.save();
    posts.push(post);

    author.posts.push(post.id);
    await author.save();
  }

  return { save };
}

export default dataManager;
