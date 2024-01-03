import testServer from "../database/mongoConfigTesting";
import manager from "../database/data";

const mongoServer = testServer(); //

// https://mochajs.org/#multiple-root-hooks-in-a-single-plugin
export const mochaHooks = {
  beforeEach: [
    async function () {
      await mongoServer.initialize();
      await manager().save();
    },
  ],
  afterEach: [
    async function () {
      await mongoServer.stop();
    },
  ],
};
