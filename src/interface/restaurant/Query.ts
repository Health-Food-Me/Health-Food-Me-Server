import { Types } from "mongoose";

interface Query {
  category?: { $in: Types.ObjectId };
  name?: { $regex: string };
  location?: {
    $nearSphere: {
      $geometry: {
        type: string;
        coordinates: number[];
      };
      $maxDistance: number;
    };
  };
}

export default Query;
