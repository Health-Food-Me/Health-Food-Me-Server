import User from "../../../interface/User";

interface GetReviewsDto {
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
