import mongoose from "mongoose";
import Restaurant from "../interface/Restaurant";
import { MongoEntity } from "./Model";

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const ResaturantSchema = new mongoose.Schema({
  location: {
    type: pointSchema,
    index: "2dsphere",
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  logo: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Category",
  },
  hashtag: [
    {
      type: String,
      required: true,
    },
  ],
  address: {
    type: String,
    required: true,
  },
  workTime: [
    {
      type: String,
    },
  ],
  contact: {
    type: String,
  },
  reviews: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Review",
    },
  ],
  menus: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Menu",
    },
  ],
});

export default mongoose.model<MongoEntity<Restaurant>>(
  "Restaurant",
  ResaturantSchema,
);
