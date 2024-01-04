import request from "supertest";
import app from "../app";
import assert from "assert";
import User from "../models/user";
import Post from "../models/post";
import { iPost } from "../common/types";

describe("GET /v1/posts", function () {
  it("responds with an array of objects", async function () {
    const res = await request(app)
      .get("/v1/posts")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    assert(res.body.length > 0);
    assert.deepStrictEqual(
      new Set(res.body.map((e: iPost) => e.title)),
      new Set(["Introduction to HTML", "CSS Basics", "JavaScript Fundamentals"])
    );
  });
});

describe("POST /v1/posts/create", async function () {
  it("saves post to database", async function () {
    const userResponse = await request(app).get("/v1/users");
    const userID = userResponse.body[0]._id;

    const res = await request(app)
      .post("/v1/posts/create")
      .type("form")
      .send({
        title: "Test post 999",
        body: "this is the body",
        category: "test_category",
        summary: "this is a summary",
        author: userID,
      })
      .expect(200);

    const getResponse = await request(app).get("/v1/posts/").expect(200);

    assert(
      getResponse.body.map((e: iPost) => e.title).includes("Test post 999")
    );
  });
});

describe("POST /v1/posts/delete without authentication", function () {
  it("deletes post from database", async function () {
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

    await user.save();
    await post.save();

    await request(app)
      .post(`/v1/posts/${post.id}/delete`)
      .then(() => {
        request(app)
          .get("/v1/posts/")
          .end((err, res) => {
            assert(
              !res.body.map((e: iPost) => e.title).includes("delete_post")
            );
          });
      });
  });
});
