import mongoose from "mongoose";
import Review from "../interface/Review";
import { MongoEntity } from "./Model";

const ReviewSchema = new mongoose.Schema({});

export default mongoose.model<MongoEntity<Review>>(
  "ReviewRepository",
  ReviewSchema,
);
