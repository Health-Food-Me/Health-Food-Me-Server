import mongoose from "mongoose";
import Menu from "../interface/Menu";
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
  nutrient: {
    type: mongoose.Types.ObjectId,
    //required: true,
    ref: "Nutrient",
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
  from: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Restaurant",
  },
  isHelfoomePick: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.model<MongoEntity<Menu>>("Menu", MenuSchema);
