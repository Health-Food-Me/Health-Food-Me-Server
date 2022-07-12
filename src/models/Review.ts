import mongoose from "mongoose";
import Review from "../interface/Review";
import { MongoEntity } from "./Model";

const ReviewSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Restaurant",
  },
  writerId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  score: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
  },
  image: [{ type: String }],
  reason: [{ type: String }],
});

export default mongoose.model<MongoEntity<Review>>("Review", ReviewSchema);
