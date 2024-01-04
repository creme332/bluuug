import request from "supertest";
import app from "../app";
import assert from "assert";
import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";
import { iUser, iComment } from "../common/types";

describe("GET /v1/comments", function () {
  it("responds with an array of objects", async function () {
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
  it("saves comment to database", async function () {
    const user = new User({
      email: "dsademail@email.com",
      name: "user3433",
      password: "hashedPassword",
    });

    const post = new Post({
      title: "delete_post",
      body: "this is the body",
      category: "test_category",
      summary: "this is a summary",
      timestamp: new Date(),
      author: user.id,
    });

    await request(app)
      .post("/v1/comments/create")
      .type("form")
      .send({
        text: "unique_comment_1232432",
        post: post.id,
        author: user.id,
      })
      .expect(200);

    const getResponse = await request(app).get("/v1/comments/").expect(200);

    assert(
      getResponse.body
        .map((e: iComment) => e.text)
        .includes("unique_comment_1232432")
    );
  });
});

describe("POST /v1/comments/delete without authentication", function () {
  it("deletes comment from database", async function () {
    const user = new User({
      email: "dsademail@email.com",
      name: "user3433",
      password: "hashedPassword",
    });

    const post = new Post({
      title: "delete_post",
      body: "this is the body",
      category: "test_category",
      summary: "this is a summary",
      timestamp: new Date(),
      author: user.id,
    });

    const comment = new Comment({
      text: "deleted_comment",
      post: post.id,
      timestamp: new Date(),
      author: user.id,
    });

    await user.save();
    await post.save();
    await comment.save();

    await request(app).post(`/v1/comments/${comment.id}/delete`).expect(200);

    const res = await request(app).get("/v1/comments/");

    assert(!res.body.map((e: iComment) => e.text).includes("deleted_comment"));
  });
});
