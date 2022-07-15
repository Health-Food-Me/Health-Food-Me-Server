import { Types } from "mongoose";

interface Prescription {
  category: Types.ObjectId;
  content: string;
}

export default Prescription;
