import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

function TestDBServer() {
  let mongoServer: MongoMemoryServer;

  async function initialize() {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    mongoose.connect(mongoUri, { dbName: "bluuug" });

    mongoose.connection.on("error", (e) => {
      if (e.message.code === "ETIMEDOUT") {
        console.log(e);
        mongoose.connect(mongoUri);
      }
      console.log(e);
    });

    mongoose.connection.once("open", () => {
      console.log(`MongoDB successfully connected to ${mongoUri}`);
    });
  }

  async function stop() {
    if (!mongoServer) {
      console.log("Mongo server not initialized");
      return;
    }
    mongoose.disconnect();
    mongoServer.stop();
  }

  return { initialize, stop };
}

export default TestDBServer;
