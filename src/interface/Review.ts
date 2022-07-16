import mongoose from "mongoose";

interface Review {
  restaurant: mongoose.Types.ObjectId;
  writer: mongoose.Types.ObjectId;
  score: number;
  content: string;
  image: string[];
  hashtag: {
    taste: string;
    good: string[];
  };
}

export default Review;
