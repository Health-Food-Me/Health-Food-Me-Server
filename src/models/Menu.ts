import mongoose from "mongoose";
import Menu from "../interface/restaurant/Menu";
import { MongoEntity } from "./Model";

const MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  kcal: {
    type: Number,
  },
  per: {
    type: Number,
  },
  price: {
    type: Number,
    required: true,
  },
  isPick: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.model<MongoEntity<Menu>>("Menu", MenuSchema);
