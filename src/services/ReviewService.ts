import axios from "axios";
import { Types } from "mongoose";
import multer from "../config/multer";
import { logger } from "../config/winstonConfig";
import GetReviewsDto from "../interface/review/GetReviewsDto";
import ReveiwResponse from "../interface/review/ReviewResponseDto";
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

  const reviewList = restaurant.review;
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

const createReview = async (reviewResponse: ReveiwResponse) => {
  try {
    const restaurantId = reviewResponse;

    let review;
    if (reviewResponse.good) {
      review = new Review({
        restaurant: reviewResponse.restaurantId,
        writer: reviewResponse.writerId,
        score: reviewResponse.score,
        content: reviewResponse.content,
        image: reviewResponse.image,
        taste: reviewResponse.taste,
        good: reviewResponse.good,
      });
    } else {
      review = new Review({
        restaurant: reviewResponse.restaurantId,
        writer: reviewResponse.writerId,
        score: reviewResponse.score,
        content: reviewResponse.content,
        image: reviewResponse.image,
        taste: reviewResponse.taste,
      });
    }

    const data = await review.save();

    const restaurant = await Restaurant.findById(reviewResponse.restaurantId);

    if (!restaurant) return null;

    const reviewList = restaurant.review;
    if (reviewList != undefined) {
      reviewList.push(data._id);
      await Restaurant.findByIdAndUpdate(reviewResponse.restaurantId, {
        $set: { reviews: reviewList },
      });
    } else {
      await Restaurant.findByIdAndUpdate(reviewResponse.restaurantId, {
        $set: { reviews: [data._id] },
      });
    }

    return data;
  } catch (error) {
    logger.e(error);
    throw error;
  }
};

const updateReview = async (reviewResponse: ReveiwResponse) => {
  try {
    const reviewId = reviewResponse.reviewId;
    const review = await Review.findById(reviewId);

    if (review == undefined) return null;

    const imageFileList = review.image;
    const imageList: { name: string; url: string }[] = [];

    const promises = imageFileList.map(async (file) => {
      if (reviewResponse.nameList.includes(file.name)) {
        imageList.push(file);
      } else {
        await multer.s3Delete(file.name);
      }
    });
    await Promise.all(promises);

    const promiseMerge = reviewResponse.image.map(async (image) => {
      imageList.push(image);
    });
    await Promise.all(promiseMerge);

    await Review.findByIdAndUpdate(reviewResponse.reviewId, {
      $set: {
        score: reviewResponse.score,
        taste: reviewResponse.taste,
        good: reviewResponse.good,
        content: reviewResponse.content,
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
