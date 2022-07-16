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

export interface NaverBlogReviewResponse {
  start: number;
  display: number;
  items: BlogReviewContent[];
}

export interface BlogReviewContent {
  title: string;
  link: string;
  description: string;
  bloggername: string;
  bloggerlink: string;
  postdate: string;
}

export default Review;
