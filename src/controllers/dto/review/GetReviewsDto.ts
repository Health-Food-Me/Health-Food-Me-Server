import mongoose from "mongoose";
import User from "../../../interface/User";

interface GetReviewsDto {
  id: string | mongoose.Types.ObjectId;
  writer: User;
  score: number;
  content: string;
  image: string[];
  hashtag: ReviewTagDto;
}

export interface ReviewTagDto {
  taste: string;
  good: string[];
}

export default GetReviewsDto;
