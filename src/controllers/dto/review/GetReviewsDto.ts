import User from "../../../interface/User";

interface GetReviewsDto {
  writer: User;
  score: number;
  content: string;
  image: string[];
  reason: ReviewTagDto;
}

export interface ReviewTagDto {
  taste: string;
  good: string[] | null;
}

export default GetReviewsDto;
