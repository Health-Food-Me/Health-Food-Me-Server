import mongoose from "mongoose";
import INutrient from "../interface/Nutrient";
import { DataModel } from "./Model";

const NutrientSchema = new mongoose.Schema({
  kcal: {
    type: Number,
    required: true,
  },
  carbohydrate: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },
  menuId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Menu",
  },
});

export default mongoose.model<DataModel<INutrient>>("Nutrient", NutrientSchema);
