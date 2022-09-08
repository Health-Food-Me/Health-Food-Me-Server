import mongoose from "mongoose";
import Prescription from "../interface/restaurant/Prescription";
import { MongoEntity } from "./Model";

const PrescriptionSchema = new mongoose.Schema({
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
});

export default mongoose.model<MongoEntity<Prescription>>(
  "Prescription",
  PrescriptionSchema,
);
