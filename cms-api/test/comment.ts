import request from "supertest";
import app from "../app";
import assert from "assert";
import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";
import { iComment } from "../common/types";
import dotenv from "dotenv";

dotenv.config();

const testUser = {
  email: "test_user@bluuug.com",
  password: "test_password",
}; // ! a user with these credentials must exist in the database

describe("GET /v1/comments", function () {
  it("responds with an array of comments", async function () {
    const res = await request(app)
      .get("/v1/comments")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    assert(res.body.length > 0);

    const receivedComments = res.body.map((e: iComment) => e.text);
    const expectedComments = (await Comment.find({}, { _id: 0, text: 1 }))?.map(
      (e) => e.text
    );

    assert.deepStrictEqual(
      new Set(receivedComments),
      new Set(expectedComments)
    );
  });
});

describe("POST /v1/comments/create", function () {
  it("forbids comment creation without access token", async function () {
    const validPostID = (await Post.findOne({}))?._id;
    const validUserID = (await User.findOne({}))?._id;

    await request(app)
      .post("/v1/comments/create")
      .type("form")
      .send({
        text: "unique_comment_1232432",
        post: validPostID,
        author: validUserID,
      })
      .expect(401);
  });

  it("forbids comment creation by non-admin access token", async function () {
    // get access token by logging in
    const accessToken = (
      await request(app).post("/v1/auth/login").type("form").send(testUser)
    )?.body.accessToken;

    // find attributes for comments
    const validPostID = (await Post.findOne({}))?._id;
    const validUserID = (await User.findOne({}))?._id;

    // attempt to create comment
    await request(app)
      .post("/v1/comments/create")
      .set("Authorization", `Bearer ${accessToken}`)
      .type("form")
      .send({
        text: "unique_comment_1232432",
        post: validPostID,
        author: validUserID,
      })
      .expect(401);
  });

  it("allows comment creation with admin token", async function () {
    // get access token by logging in with admin credentials
    const accessToken = (
      await request(app).post("/v1/auth/login").type("form").send({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      })
    )?.body.accessToken;

    // create new comment object
    const user = await User.findOne({});
    const validPostID = (await Post.findOne({}))?.id;
    const newComment = {
      text: "unique_comment_1232432",
      post: validPostID?.toString(),
      author: user?.id,
    };

    await request(app)
      .post("/v1/comments/create")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .type("form")
      .send(newComment)
      .expect(200);

    const matchingComments = await Comment.find({
      text: newComment.text,
    });

    assert(matchingComments.length === 1);
    assert.equal(newComment.post?.toString(), validPostID);
    assert.equal(newComment.author.toString(), user?.id);
  });
});

describe("POST /v1/comments/delete", function () {
  it("forbids comment deletion by unsigned users", async function () {
    const comment = await Comment.findOne({});

    await request(app).post(`/v1/comments/${comment?.id}/delete`).expect(401);

    const allComments = await Comment.find({});

    assert(
      !allComments.map((e: iComment) => e.text).includes("deleted_comment")
    );
  });

  it("allows comment deletion with admin token", async function () {
    // get access token by logging in with admin credentials
    const accessToken = (
      await request(app).post("/v1/auth/login").type("form").send({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      })
    )?.body.accessToken;

    const commentToBeDeleted = await Comment.findOne({});

    await request(app)
      .post(`/v1/comments/${commentToBeDeleted?.id}/delete`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    const res = await request(app).get("/v1/comments/");

    assert(!res.body.map((e: iComment) => e.text).includes("deleted_comment"));
  });
});
