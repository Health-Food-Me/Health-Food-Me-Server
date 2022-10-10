import mongoose from "mongoose";

interface GetReviews {
  _id: string | mongoose.Types.ObjectId;
  writer?: string;
  restaurant?: string;
  restaurantId?: mongoose.Types.ObjectId;
  score: number;
  content: string;
  image: {
    name: string;
    url: string;
  }[];
  taste: string;
  good: string[];
  createdAt: string;
}

export default GetReviews;
