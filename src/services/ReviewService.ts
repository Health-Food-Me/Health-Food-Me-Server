import axios from "axios";
import GetReviewsDto from "../controllers/dto/review/GetReviewsDto";
import { NaverBlogReviewResponse } from "../interface/Review";
import IUser from "../interface/User";
import Review from "../models/Review";

const getReviewsByRestaurant = async (id: string) => {
  const reviews = await Review.find({
    restaurant: id,
  }).populate<{ writer: IUser }>("writer");

  const reviewDto: GetReviewsDto[] = reviews.map((review) => {
    return {
      id: review._id,
      writer: review.writer,
      score: review.score,
      content: review.content,
      image: review.image,
      hashtag: {
        taste: review.hashtag.taste,
        good: review.hashtag.good,
      },
    };
  });
  return reviewDto;
};

const getReviewsByUser = async (id: string) => {
  const reviews = await Review.find({
    writer: id,
  }).populate<{ writer: IUser }>("writer");

  const reviewDto: GetReviewsDto[] = reviews.map((review) => {
    return {
      id: review._id,
      writer: review.writer,
      score: review.score,
      content: review.content,
      image: review.image,
      hashtag: {
        taste: review.hashtag.taste,
        good: review.hashtag.good,
      },
    };
  });
  return reviewDto;
};

const deleteReview = async (id: string) => {
  await Review.deleteOne({ _id: id });
};

const getReviewsFromNaver = async (name: string) => {
  const requestUrl = `https://openapi.naver.com/v1/search/blog?query=${name}`;
  const result = await axios.get<NaverBlogReviewResponse>(requestUrl, {
    headers: {
      "X-Naver-Client-Id": "SG2hLClLCFrOIl5uQh3y",
      "X-Naver-Client-Secret": "xwsh8rft0T",
    },
  });
  return result;
};

export default {
  getReviewsByRestaurant,
  getReviewsByUser,
  deleteReview,
  getReviewsFromNaver,
};
