import { logger } from "../config/winstonConfig";
import GetReviewsDto from "../controllers/dto/review/GetReviewsDto";
import ReveiwResponseDto from "../controllers/dto/review/ReviewResponseDto";
import axios from "axios";
import { NaverBlogReviewResponse } from "../interface/Review";
import IUser from "../interface/User";
import Restaurant from "../models/Restaurant";
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
  const encodedName = encodeURI(name);
  const requestUrl = `https://openapi.naver.com/v1/search/blog?query=${encodedName}`;
  const result = await axios.get<NaverBlogReviewResponse>(requestUrl, {
    headers: {
      "X-Naver-Client-Id": "SG2hLClLCFrOIl5uQh3y",
      "X-Naver-Client-Secret": "xwsh8rft0T",
    },
  });

  const blogReviews: NaverBlogReviewResponse = {
    start: result.data.start,
    display: result.data.display,
    items: result.data.items,
  };
  return blogReviews;
};

const createReview = async (reviewResponseDto: ReveiwResponseDto) => {
  try {
    const review = new Review({
      restaurant: reviewResponseDto.restaurantId,
      writer: reviewResponseDto.writerId,
      score: reviewResponseDto.score,
      content: reviewResponseDto.content,
      image: reviewResponseDto.image,
      hashtag: reviewResponseDto.hashtag,
    });

    const data = await review.save();

    const restaurant = await Restaurant.findById(
      reviewResponseDto.restaurantId,
    );

    if (!restaurant) return null;

    const reviewList = restaurant.reviews;
    if (reviewList != undefined) {
      reviewList.push(data._id);
      await Restaurant.findByIdAndUpdate(reviewResponseDto.restaurantId, {
        $set: { reviews: reviewList }
      });
    } else {
        await Restaurant.findByIdAndUpdate(reviewResponseDto.restaurantId, {
          $set: { reviews: [data._id] }
        });
      }

    return data;
  } catch (error) {
    logger.e(error);
    throw error;
  }
};

export default {
  getReviewsByRestaurant,
  createReview,
  getReviewsByUser,
  deleteReview,
  getReviewsFromNaver,
};
