import testServer from "../database/mongoConfigTesting";
import dataManager from "../database/data";
import mongoose from "mongoose";

const mongoServer = testServer(); //

// https://mochajs.org/#multiple-root-hooks-in-a-single-plugin
export const mochaHooks = {
  beforeAll: [
    async function () {
      await mongoServer.initialize();
    },
  ],
  beforeEach: [
    async function () {
      await dataManager().save();
    },
  ],
  afterEach: [
    async function () {
      await mongoose.connection.db.dropDatabase();
    },
  ],
  afterAll: [
    async function () {
      await mongoServer.stop();
    },
  ],
};
