import { Types } from "mongoose";

interface Prescription {
  category: Types.ObjectId;
  content: {
    recommend: string[];
    tip: string[];
  };
}

export default Prescription;
