import request from "supertest";
import app from "../app";
import assert from "assert";
import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";
import { iComment } from "../common/types";

const sampleUser = {
  email: "creme332@bluuug.com",
  password: "sample_password",
};

describe("GET /v1/comments", function () {
  it("responds with an array of comments", async function () {
    const res = await request(app)
      .get("/v1/comments")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    assert(res.body.length > 0);

    assert.deepStrictEqual(
      new Set(res.body.map((e: iComment) => e.text)),
      new Set([
        "Comment 1 for Post 1",
        "Comment 2 for Post 1",
        "Comment 1 for Post 2",
        "Comment 2 for Post 2",
      ])
    );
  });
});

describe("POST /v1/comments/create", function () {
  it("forbids comment creation by unauthenticated users", async function () {
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

  it("allows comment creation by authenticated users", async function () {
    const user = await User.findOne({});
    const validPostID = (await Post.findOne({}))?.id;

    // login
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .type("form")
      .send(sampleUser)
      .expect(200);

    await request(app)
      .post("/v1/comments/create")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${loginResponse.body.accessToken}`)
      .type("form")
      .send({
        text: "unique_comment_1232432",
        post: validPostID?.toString(),
        author: user?.id,
      })
      .expect(200);

    const newComment = await Comment.findOne({
      text: "unique_comment_1232432",
    });

    assert(newComment);
    assert.equal(newComment.post?.toString(), validPostID?.toString());
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

  it("allows comment deletion by signed users", async function () {
    // login
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .type("form")
      .send(sampleUser)
      .expect(200);

    const commentToBeDeleted = await Comment.findOne({});

    await request(app)
      .post(`/v1/comments/${commentToBeDeleted?.id}/delete`)
      .set("Authorization", `Bearer ${loginResponse.body.accessToken}`)
      .expect(200);

    const res = await request(app).get("/v1/comments/");

    assert(!res.body.map((e: iComment) => e.text).includes("deleted_comment"));
  });
});
