import request from "supertest";
import app from "../app";
import assert from "assert";
import { iUser } from "../common/types";

describe("GET /v1/users", function () {
  it("responds with json", async function () {
    request(app)
      .get("/v1/users")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        assert(res.body.length > 0);
        assert.deepStrictEqual(
          new Set(res.body.map((e: iUser) => e.name)),
          new Set(["creme332", "test_user", "harry kane"])
        );
      });
  });
});

describe("POST /v1/users/create", function () {
  it("saves user to database", function () {
    request(app)
      .post("/v1/users/create")
      .type("form")
      .send({
        email: "pppp@gmail.com",
        password: "hello33",
        name: "test_user_999",
      })
      .then(() => {
        request(app)
          .get("/v1/users/")
          .end((err, res) => {
            assert(
              res.body.map((e: iUser) => e.name).includes("test_user_999")
            );
          });
      });
  });
});
