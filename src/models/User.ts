import mongoose from "mongoose";
import { User } from "../interface/User";
import { MongoEntity } from "./Model";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  social: {
    type: String,
    required: true,
    unique: true,
  },
  socialId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  scrapRestaurants: [
    {
      restaurantId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Restaurant",
      },
    },
  ],
  refreshToken: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.model<MongoEntity<User>>("User", UserSchema);
