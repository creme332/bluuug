import testServer from "../database/mongoConfigTesting";
import dataManager from "../database/data";

const mongoServer = testServer(); //

// https://mochajs.org/#multiple-root-hooks-in-a-single-plugin
export const mochaHooks = {
  before: [
    async function () {
      await mongoServer.initialize();
      await dataManager().save();
    },
  ],
  // after: [
  //   async function () {
  //     await mongoServer.stop();
  //   },
  // ],
};
