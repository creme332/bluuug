import request from "supertest";
import app from "../app";

describe("GET /v1/users", function () {
  it("responds with json", function (done) {
    request(app)
      .get("/v1/users")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      //   .expect({ name: "frodo" })
      .expect(200, done);
  });
});

// describe("POST /v1/users/create", function () {
//   it("responds with json", function (done) {
//     request(app)
//       .post("/v1/users/create")
//       .type("form")
//       .send({ item: "hey" })
//       .then(() => {
//         request(app)
//           .get("/v1/users/")
//           .expect({ array: ["hey"] }, done);
//       });
//   });
// });
