import mongoose from "mongoose";
import config from ".";
import { logger } from "./winstonConfig";

const configMongoose = async () => {
  if (process.env.MODE_ENV !== "production") {
    mongoose.set("debug", true);
  }

  mongoose.connect(
    config.mongoURI,
    {
      // dbname: 'DBName',
      autoCreate: true,
    },
    (error) => {
      if (error) {
        logger.e("MongoDB Init Error");
      } else {
        logger.i("MonogDB Init Success!!");
      }
    },
  );

  // TODO Collection Create Logic
};

mongoose.connection.on("error", (error) => {
  logger.e("MongoDB Connection Error", error);
});
mongoose.connection.on("disconnected", () => {
  logger.e("MongoDB Disconnected. Try Connect");
  configMongoose();
});

export default configMongoose;
