import request from "supertest";
import app from "../app";
import assert from "assert";
import User from "../models/user";
import { iUser } from "../common/types";
import dotenv from "dotenv";

dotenv.config();

const testUser = {
  email: "test_user@bluuug.com",
  password: "test_password",
}; // ! a user with these credentials must exist in the database

describe("GET /v1/users", function () {
  it("responds with an array of objects", async function () {
    const res = await request(app)
      .get("/v1/users")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    assert(res.body.length > 0);

    // check if objects returned by API match database
    const allNames = (await User.find({})).map((e) => e.name);
    assert.deepStrictEqual(
      new Set(res.body.map((e: iUser) => e.name)),
      new Set(allNames)
    );
  });
});

describe("GET /v1/users/:id", function () {
  it("responds with a user object", async function () {
    const expectedUser = await User.findOne({});

    const res = await request(app)
      .get(`/v1/users/${expectedUser?.id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    const receivedUser = res.body;

    assert(expectedUser?.id === receivedUser._id);
    assert(expectedUser?.name === receivedUser.name);
  });
});

describe("POST /v1/users/create", function () {
  it("accepts requests from anyone", async function () {
    const newUser = {
      email: "pppp@gmail.com",
      password: "hellogdfg33",
      name: "test_user_999",
    };
    await request(app)
      .post("/v1/users/create")
      .type("form")
      .send(newUser)
      .expect(200);

    // check if user created successfully
    const testNewUser = await User.findOne({ email: newUser.email });
    assert(testNewUser);
  });
});

describe("POST /v1/users/delete", function () {
  it("forbids request without access token", async function () {
    // create a new user on which deletion will be tested
    const newUser = new User({
      email: "email@email.com",
      name: "user_no_delete",
      password: "hashedPassword",
    });
    await newUser.save();

    // make a delete request through API
    await request(app).post(`/v1/users/${newUser.id}/delete`).expect(401);

    // ensure that no users have been deleted
    const allUsers = await User.find({});
    assert(allUsers.map((e: iUser) => e.name).includes(newUser.name));
  });

  it("forbids request with non-admin access token", async function () {
    // get access token by logging in with normal user credentials
    const accessToken = (
      await request(app).post("/v1/auth/login").type("form").send(testUser)
    )?.body.accessToken;

    // create a new user which will be deleted
    const newUser = new User({
      email: "email@email.com",
      name: "test_user_no_delete",
      password: "hashedPassword",
    });
    await newUser.save();

    // make a delete request using token through API
    await request(app)
      .post(`/v1/users/${newUser.id}/delete`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(401);

    // ensure that no users have been deleted
    const allUsers = await User.find({});
    assert(allUsers.map((e: iUser) => e.name).includes(newUser.name));
  });

  it("accepts request with admin access token", async function () {
    // get access token by logging in with admin credentials
    const accessToken = (
      await request(app).post("/v1/auth/login").type("form").send({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      })
    )?.body.accessToken;

    // create a new user which will be deleted
    const newUser = new User({
      email: "deleted_user_email@email.com",
      name: "deleted_user",
      password: "hashedPassword",
    });
    await newUser.save();

    // make a delete request using access token
    await request(app)
      .post(`/v1/users/${newUser.id}/delete`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    // check if user has been successfully deleted
    const deletedUser = await User.findOne({
      email: newUser.email,
    });

    assert(!deletedUser);
  });
});
