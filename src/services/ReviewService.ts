import axios from "axios";
import { Types } from "mongoose";
import multer from "../config/multer";
import { logger } from "../config/winstonConfig";
import GetReviewsDto from "../interface/review/GetReviewsDto";
import ReveiwResponseDto from "../interface/review/ReviewResponseDto";
import IRestaurant from "../interface/restaurant/Restaurant";
import { NaverBlogReviewResponse } from "../interface/review/Review";
import IUser from "../interface/user/User";
import Restaurant from "../models/Restaurant";
import Review from "../models/Review";

const getReviewsByRestaurant = async (id: string) => {
  const reviews = await Review.find({
    restaurant: id,
  }).populate<{ writer: IUser }>("writer");

  const reviewDto: GetReviewsDto[] = reviews.map((review) => {
    return {
      id: review._id,
      writer: review.writer.name,
      score: review.score,
      content: review.content,
      image: review.image,
      taste: review.taste,
      good: review.good,
    };
  });
  return reviewDto;
};

const getReviewsByUser = async (id: string) => {
  const reviews = await Review.find({
    writer: id,
  }).populate<{ restaurant: IRestaurant }>("restaurant");

  const reviewDto: GetReviewsDto[] = reviews.map((review) => {
    return {
      id: review._id,
      restaurant: review.restaurant.name,
      restaurantId: review.restaurant._id,
      score: review.score,
      content: review.content,
      image: review.image,
      taste: review.taste,
      good: review.good,
    };
  });
  return reviewDto;
};

const deleteReview = async (id: string) => {
  const restaurant = await Restaurant.findOne({
    reviews: id,
  });

  // 식당 리뷰 id 배열에서 삭제
  if (!restaurant) return null;

  const reviewList = restaurant.reviews;
  const updateList = reviewList.filter((review) => {
    review !== (id as unknown as Types.ObjectId);
  });
  await Restaurant.findByIdAndUpdate(restaurant._id, {
    $set: { reviews: updateList },
  });

  const review = await Review.findById(id);
  if (!review) return null;

  const promises = review.image.map(async (data) => {
    await multer.s3Delete(data.name);
  });
  await Promise.all(promises);

  // 데이터 삭제
  //await Review.deleteOne({ _id: id });
  await Review.findByIdAndDelete(id);
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
    let review;
    if (reviewResponseDto.good) {
      review = new Review({
        restaurant: reviewResponseDto.restaurantId,
        writer: reviewResponseDto.writerId,
        score: reviewResponseDto.score,
        content: reviewResponseDto.content,
        image: reviewResponseDto.image,
        taste: reviewResponseDto.taste,
        good: reviewResponseDto.good,
      });
    } else {
      review = new Review({
        restaurant: reviewResponseDto.restaurantId,
        writer: reviewResponseDto.writerId,
        score: reviewResponseDto.score,
        content: reviewResponseDto.content,
        image: reviewResponseDto.image,
        taste: reviewResponseDto.taste,
      });
    }

    const data = await review.save();

    const restaurant = await Restaurant.findById(
      reviewResponseDto.restaurantId,
    );

    if (!restaurant) return null;

    const reviewList = restaurant.reviews;
    if (reviewList != undefined) {
      reviewList.push(data._id);
      await Restaurant.findByIdAndUpdate(reviewResponseDto.restaurantId, {
        $set: { reviews: reviewList },
      });
    } else {
      await Restaurant.findByIdAndUpdate(reviewResponseDto.restaurantId, {
        $set: { reviews: [data._id] },
      });
    }

    return data;
  } catch (error) {
    logger.e(error);
    throw error;
  }
};

const updateReview = async (reviewResponseDto: ReveiwResponseDto) => {
  try {
    const reviewId = reviewResponseDto.reviewId;
    const review = await Review.findById(reviewId);

    if (review == undefined) return null;

    const imageFileList = review.image;
    const imageList: { name: string; url: string }[] = [];

    const promises = imageFileList.map(async (file) => {
      if (reviewResponseDto.nameList.includes(file.name)) {
        imageList.push(file);
      } else {
        await multer.s3Delete(file.name);
      }
    });
    await Promise.all(promises);

    const promiseMerge = reviewResponseDto.image.map(async (image) => {
      imageList.push(image);
    });
    await Promise.all(promiseMerge);

    await Review.findByIdAndUpdate(reviewResponseDto.reviewId, {
      $set: {
        score: reviewResponseDto.score,
        taste: reviewResponseDto.taste,
        good: reviewResponseDto.good,
        content: reviewResponseDto.content,
        image: imageList,
      },
    });

    const result = await Review.findById(reviewId);

    return result;
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
  updateReview,
};
