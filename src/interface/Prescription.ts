import { Types } from "mongoose";

interface Prescription {
  category: Types.ObjectId;
  content: {
    recommend: string[];
    eating: string[];
  };
}

export default Prescription;
