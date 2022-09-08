import { Types } from "mongoose";

interface Query {
  category: {
    $in: Types.ObjectId;
  };
}

export default Query;
