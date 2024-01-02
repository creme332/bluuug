import initializeMongoServer from "../database/mongoConfigTesting";

export const mochaHooks = {
  beforeEach(done: () => void) {
    initializeMongoServer();
    done();
  },
};
