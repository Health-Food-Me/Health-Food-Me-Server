import mongoose from "mongoose";
import Prescription from "../interface/Prescription";
import { MongoEntity } from "./Model";

const PrescriptionSchema = new mongoose.Schema({
  category: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Category",
  },
  content: {
    type: String,
    required: true,
  },
});

export default mongoose.model<MongoEntity<Prescription>>(
  "Prescription",
  PrescriptionSchema,
);
