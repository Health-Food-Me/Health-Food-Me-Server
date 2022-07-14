import mongoose from "mongoose";
import Category from "../interface/Category";
import { MongoEntity } from "./Model";

const CategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  prescriptions: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Prescription",
  },
  isDiet: {
    type: Boolean,
    require: true,
  },
});

export default mongoose.model<MongoEntity<Category>>(
  "Category",
  CategorySchema,
);
