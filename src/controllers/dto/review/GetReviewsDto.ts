import mongoose from "mongoose";

interface GetReviewsDto {
  id: string | mongoose.Types.ObjectId;
  writer?: string;
  restaurant?: string;
  score: number;
  content: string;
  image: {
    name: string;
    url: string;
  }[];
  taste: string;
  good: string[];
}

export default GetReviewsDto;
