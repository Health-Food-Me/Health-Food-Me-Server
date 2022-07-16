import mongoose from "mongoose";
import Review from "../interface/Review";
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
  },
  image: [{ type: String }],
  hashtag: {
    taste: {
      type: String,
      required: true,
    },
    good: [{ type: String }],
  },
});

export default mongoose.model<MongoEntity<Review>>("Review", ReviewSchema);
