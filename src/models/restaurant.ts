import mongoose from "mongoose";
import IRestaurant from "../interface/Restaurant";
import { DataModel } from "./Model";

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
    type: String,
    required: true,
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

export default mongoose.model<DataModel<IRestaurant>>(
  "Restaurant",
  ResaturantSchema,
);
