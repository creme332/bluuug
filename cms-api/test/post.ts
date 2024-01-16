import request from "supertest";
import app from "../app";
import assert from "assert";
import Post from "../models/post";
import { iPost } from "../common/types";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const testUser = {
  email: "test_user@bluuug.com",
  password: "test_password",
}; // ! a user with these credentials must exist in the database

describe("GET /v1/posts", function () {
  it("responds with an array of posts", async function () {
    const res = await request(app)
      .get("/v1/posts")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    const allPostNames = (await Post.find({})).map((e) => e.title);

    assert.deepStrictEqual(
      new Set(res.body.map((e: iPost) => e.title)),
      new Set(allPostNames)
    );
  });
});

describe("POST /v1/posts/create", async function () {
  it("forbids post creation by unauthenticated user", async function () {
    await request(app)
      .post("/v1/posts/create")
      .type("form")
      .send({
        title: "Test post 999",
        body: "this is the body",
        category: "test_category",
        summary: "this is a summary",
      })
      .expect(401);
  });

  it("forbids post creation if non-admin token present", async function () {
    // get access token by logging in with normal user credentials
    const accessToken = (
      await request(app).post("/v1/auth/login").type("form").send(testUser)
    )?.body.accessToken;

    await request(app)
      .post("/v1/posts/create")
      .set("Authorization", `Bearer ${accessToken}`)
      .type("form")
      .send({
        title: "Test post 999",
        body: "this is the body",
        category: "test_category",
        summary: "this is a summary",
      })
      .expect(401);
  });

  it("creates post if admin token present", async function () {
    // get access token by logging in with admin credentials
    const accessToken = (
      await request(app).post("/v1/auth/login").type("form").send({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      })
    )?.body.accessToken;

    // create a post
    const newPost = {
      title: "unique_authenticated_post",
      body: "this is the body",
      category: "test_category",
      summary: "this is a summary",
    };
    await request(app)
      .post("/v1/posts/create")
      .set("Authorization", `Bearer ${accessToken}`)
      .type("form")
      .send(newPost)
      .expect(200);

    // check if post was successfully created
    const matchingPosts = await Post.find({ title: newPost.title });

    assert(matchingPosts.length == 1);
    assert(matchingPosts[0].body === newPost.body);
    assert(matchingPosts[0].category === newPost.category);
    assert(matchingPosts[0].summary === newPost.summary);
  });
});

describe("POST /v1/posts/delete", function () {
  it("forbid post deletion by unauthenticated user", async function () {
    // get the id of some post
    const postID = (await Post.findOne({}))?.id;

    // send delete request
    await request(app).post(`/v1/posts/${postID}/delete`).expect(401);
  });

  it("forbid post deletion with non-admin access token", async function () {
    // get access token by logging in with admin credentials
    const accessToken = (
      await request(app).post("/v1/auth/login").type("form").send(testUser)
    )?.body.accessToken;

    // get the id of some post
    const postID = (await Post.findOne({}))?.id;

    // send delete request
    await request(app)
      .post(`/v1/posts/${postID}/delete`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(401);
  });

  it("allow post deletion with admin token", async function () {
    // get access token by logging in with admin credentials
    const accessToken = (
      await request(app).post("/v1/auth/login").type("form").send({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      })
    )?.body.accessToken;

    // get the id of some post
    const postID = (await Post.findOne({}))?.id;

    // post delete request
    await request(app)
      .post(`/v1/posts/${postID}/delete`)
      .set("Authorization", `Bearer ${accessToken}`);

    // check if post was successfully deleted
    const matchingPost = await Post.find({
      _id: new mongoose.Types.ObjectId(postID),
    });
    assert(matchingPost.length === 0);
  });
});
