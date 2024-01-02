import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Set up mongoose connection
mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));
async function main() {
  if (!process.env.MONGO_STRING) {
    console.error("Invalid mongo string");
    return;
  }
  await mongoose.connect(process.env.MONGO_STRING);
}
