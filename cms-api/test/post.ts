import request from "supertest";
import app from "../app";
import assert from "assert";
import User from "../models/user";
import Post from "../models/post";
import { iPost } from "../common/types";

const sampleUser = {
  email: "creme332@bluuug.com",
  password: "sample_password",
};

describe("GET /v1/posts", function () {
  it("responds with an array of posts", async function () {
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
  it("forbid creation by unauthenticated user", async function () {
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

  it("allow creation by authenticated user", async function () {
    // get access token through login
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .type("form")
      .send(sampleUser)
      .expect(200);

    // create a post
    await request(app)
      .post("/v1/posts/create")
      .set("Authorization", `Bearer ${loginResponse.body.accessToken}`)
      .type("form")
      .send({
        title: "unique_authenticated_post",
        body: "this is the body",
        category: "test_category",
        summary: "this is a summary",
      })
      .expect(200);

    // fetch all posts from database
    const getResponse = await request(app).get("/v1/posts/").expect(200);
    const matchingPosts = getResponse.body.filter(
      (e: iPost) => e.title === "unique_authenticated_post"
    );

    assert(matchingPosts.length == 1);
    assert(matchingPosts[0].body === "this is the body");
    assert(matchingPosts[0].category === "test_category");
    assert(matchingPosts[0].summary === "this is a summary");
  });
});

describe("POST /v1/posts/delete", function () {
  it("forbid deletion by unauthenticated user", async function () {
    const user = (
      await User.find({
        email: sampleUser.email,
      })
    )[0];

    // create a new post to be deleted
    const post = new Post({
      title: "delete_post",
      body: "this is the body",
      category: "test_category",
      summary: "this is a summary",
      timestamp: new Date(),
      author: user._id,
    });

    await post.save();

    await request(app).post(`/v1/posts/${post.id}/delete`).expect(401);
  });

  it("allow deletion by authenticated user", async function () {
    const user = (
      await User.find({
        email: sampleUser.email,
      })
    )[0];

    const post = new Post({
      title: "delete_post",
      body: "this is the body",
      category: "test_category",
      summary: "this is a summary",
      timestamp: new Date(),
      author: user._id,
    });

    await post.save();

    // get access token through login
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .type("form")
      .send(sampleUser)
      .expect(200);

    await request(app)
      .post(`/v1/posts/${post.id}/delete`)
      .set("Authorization", `Bearer ${loginResponse.body.accessToken}`)
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
