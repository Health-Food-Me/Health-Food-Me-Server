import axios from "axios";
import multer from "../config/multer";
import { logger } from "../config/winstonConfig";
import GetReviews from "../interface/review/GetReviews";
import ReveiwResponse from "../interface/review/ReviewResponseDto";
import IRestaurant from "../interface/restaurant/Restaurant";
import { NaverBlogReviewResponse } from "../interface/review/Review";
import IUser from "../interface/user/User";
import Restaurant from "../models/Restaurant";
import Review from "../models/Review";
import User from "../models/User";
import config from "../config";

const getReviewsByRestaurant = async (restaurantId: string) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) return null;

  const reviews = restaurant.review;
  const reviewList: GetReviews[] = [];

  const promises = reviews.map(async (reviewId) => {
    const review = await Review.findById(reviewId).populate<{ writer: IUser }>(
      "writer",
    );

    if (review) {
      let images = review.image;
      if (!images) images = [];
      let goods = review.good;
      if (!goods) goods = [];

      const data: GetReviews = {
        _id: reviewId,
        writer: review.writer.name,
        score: review.score,
        content: review.content,
        image: images,
        taste: review.taste,
        good: goods,
      };
      reviewList.push(data);
    }
  });
  await Promise.all(promises);

  return reviewList;
};

const getReviewsByUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) return null;

  const reviews = user.reviews;
  const reviewList: GetReviews[] = [];

  const promises = reviews.map(async (reviewId) => {
    const review = await Review.findById(reviewId).populate<{
      restaurant: IRestaurant;
    }>("restaurant");

    if (review) {
      let images = review.image;
      if (!images) images = [];
      let goods = review.good;
      if (!goods) goods = [];

      const data: GetReviews = {
        _id: review._id,
        restaurantId: review.restaurant._id,
        restaurant: review.restaurant.name,
        score: review.score,
        content: review.content,
        image: images,
        taste: review.taste,
        good: goods,
      };

      reviewList.push(data);
    }
  });
  await Promise.all(promises);

  return reviewList;
};

const deleteReview = async (reviewId: string) => {
  const review = await Review.findById(reviewId)
    .populate<{ writer: IUser }>("writer")
    .populate<{ restaurant: IRestaurant }>("restaurant");

  if (!review) return null;

  if (review.restaurant) {
    const restaurantReviewList = review.restaurant.review;

    const restaurantReviewResult = restaurantReviewList.filter(
      (review) => review.toString() !== reviewId,
    );

    await Restaurant.findByIdAndUpdate(review.restaurant._id, {
      $set: { review: restaurantReviewResult },
    });
  }

  if (review.writer) {
    const userReviewList = review.writer.reviews;

    const userReviewResult = userReviewList.filter(
      (review) => review.toString() !== reviewId,
    );

    await User.findByIdAndUpdate(review.writer._id, {
      $set: { reviews: userReviewResult },
    });
  }

  const promises = review.image.map(async (data) => {
    await multer.s3Delete(data.name);
  });
  await Promise.all(promises);

  await Review.findByIdAndDelete(reviewId);

  return true;
};

const getReviewsFromNaver = async (restaurantId: string) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) return null;

  const name = restaurant.name;
  const encodedName = encodeURI(name);
  const requestUrl = `https://openapi.naver.com/v1/search/blog?query=${encodedName}`;
  const result = await axios.get<NaverBlogReviewResponse>(requestUrl, {
    headers: {
      "X-Naver-Client-Id": config.naverClientId,
      "X-Naver-Client-Secret": config.naverClientSecret,
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
    const restaurantId = reviewResponse.restaurantId;
    const restaurant = await Restaurant.findById(restaurantId);

    const userId = reviewResponse.writerId;
    const user = await User.findById(userId);

    if (!restaurant || !user) return null;

    let good = reviewResponse.good;
    if (!good) good = [];

    const review = new Review({
      restaurant: restaurantId,
      writer: userId,
      score: reviewResponse.score,
      content: reviewResponse.content,
      image: reviewResponse.image,
      taste: reviewResponse.taste,
      good: good,
    });
    const result = await review.save();

    let restaurantReviewList = restaurant.review;
    if (!restaurantReviewList) restaurantReviewList = [];

    restaurantReviewList.push(result._id);
    await Restaurant.findByIdAndUpdate(restaurantId, {
      $set: { review: restaurantReviewList },
    });

    let userReviewList = user.reviews;
    if (!userReviewList) userReviewList = [];

    userReviewList.push(result._id);
    await User.findByIdAndUpdate(userId, {
      $set: { reviews: userReviewList },
    });

    const data = {
      _id: result._id,
      restaurantId: restaurantId,
      restaurant: restaurant.name,
      writerId: userId,
      writer: user.name,
      score: result.score,
      content: result.content,
      image: result.image,
      taste: result.taste,
      good: result.good,
    };

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
    if (!review) return null;

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

    const result = await Review.findByIdAndUpdate(
      reviewResponse.reviewId,
      {
        $set: {
          score: reviewResponse.score,
          taste: reviewResponse.taste,
          good: reviewResponse.good,
          content: reviewResponse.content,
          image: imageList,
        },
      },
      { new: true },
    );

    if (!result) return null;

    const restaurantId = result.restaurant;
    const restaurant = await Restaurant.findById(restaurantId);
    const userId = result.writer;
    const user = await User.findById(userId);

    if (!restaurant || !user) {
      await deleteReview(result._id);
      return null;
    }

    const data = {
      _id: result._id,
      restaurantId: restaurantId,
      restaurant: restaurant.name,
      writerId: userId,
      writer: user.name,
      score: result.score,
      content: result.content,
      image: result.image,
      taste: result.taste,
      good: result.good,
    };

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
  updateReview,
};
