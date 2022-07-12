import mongoose from "mongoose";
import Restaurant from "../interface/Restaurant";
import { MongoEntity } from "./Model";

const ResaturantSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  logo: {
    type: String,
    required: true,
    unique: true,
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
  worktime: [
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
      required: true,
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
