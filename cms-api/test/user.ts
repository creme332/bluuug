import request from "supertest";
import app from "../app";
import assert from "assert";
import User from "../models/user";
import { iUser } from "../common/types";

describe("GET /v1/users", function () {
  it("responds with an array of objects", async function () {
    const res = await request(app)
      .get("/v1/users")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    assert(res.body.length > 0);

    assert.deepStrictEqual(
      new Set(res.body.map((e: iUser) => e.name)),
      new Set(["creme332", "test_user", "harry kane"])
    );
  });
});

describe("POST /v1/users/create", function () {
  it("saves user to database", async function () {
    await request(app)
      .post("/v1/users/create")
      .type("form")
      .send({
        email: "pppp@gmail.com",
        password: "hellogdfg33",
        name: "test_user_999",
      })
      .expect(200);

    const getResponse = await request(app).get("/v1/users/").expect(200);

    assert(
      getResponse.body.map((e: iUser) => e.name).includes("test_user_999")
    );
  });
});

describe("POST /v1/users/delete without authentication", function () {
  it("deletes user from database", async function () {
    const user = new User({
      email: "email@email.com",
      name: "deleted_user",
      password: "hashedPassword",
    });
    await user.save();

    await request(app).post(`/v1/users/${user.id}/delete`).expect(200);

    const res = await request(app).get("/v1/users/");

    assert(!res.body.map((e: iUser) => e.name).includes("deleted_user"));
  });
});
