import mongoose from "mongoose";
import { UserInfo } from "../interfaces/UserInfo";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
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

export default mongoose.model<UserInfo & mongoose.Document>("User", UserSchema);
