import mongoose from "mongoose";
import Restaurant from "../interface/restaurant/Restaurant";
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
  name: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: pointSchema,
    index: "2dsphere",
  },
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
  category: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
  ],
  isDiet: {
    type: Boolean,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  menuBoard: [
    {
      type: String,
    },
  ],
  menu: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Menu",
    },
  ],
  review: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Review",
    },
  ],
});

export default mongoose.model<MongoEntity<Restaurant>>(
  "Restaurant",
  ResaturantSchema,
);
