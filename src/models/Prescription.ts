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
    recommend: [
      {
        type: String,
        required: true,
      },
    ],
    tip: [
      {
        type: String,
        require: true,
      },
    ],
  },
});

export default mongoose.model<MongoEntity<Prescription>>(
  "Prescription",
  PrescriptionSchema,
);
