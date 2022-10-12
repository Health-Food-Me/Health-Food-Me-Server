import mongoose from "mongoose";
import Review from "../interface/review/Review";
import { MongoEntity } from "./Model";

const ReviewSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Restaurant",
  },
  writer: {
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
    required: true,
  },
  image: [
    {
      name: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  taste: {
    type: String,
    required: true,
  },
  good: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model<MongoEntity<Review>>("Review", ReviewSchema);
