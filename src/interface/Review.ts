import mongoose from "mongoose";

interface Review {
  restaurantId: string;
  writer: mongoose.Types.ObjectId;
  score: number;
  content: string;
  image: string[];
  reason: {
    taste: string;
    good: string[];
  };
}

export default Review;
