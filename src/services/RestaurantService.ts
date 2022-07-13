import { logger } from "../config/winstonConfig";
import IReview from "../interface/Review";
import Category from "../models/Category";
import Restaurant from "../models/Restaurant";
import Review from "../models/Review";
import User from "../models/User";

const getRestaurantSummary = async (restaurantId: string, userId: string) => {
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    const category = await Category.findById(restaurant?.category);
    const reviews = restaurant?.reviews;
    const user = await User.findById(userId);
    const scraps = user?.scrapRestaurants;

    let score = 0;
    let review;
    if (reviews !== undefined) {
      for (const reviewId of reviews) {
        review = await Review.findById(reviewId);
        score = score + (review as IReview).score;
      }
      if (reviews.length > 0) {
        score = Number((score / (reviews as string[]).length).toFixed(1));
      }
    }

    let isScrap = false;
    if (scraps?.find((x) => x === restaurantId) !== undefined) {
      isScrap = true;
    }

    const data = {
      _id: restaurantId,
      name: restaurant?.name,
      logo: restaurant?.logo,
      category: category?.title,
      hashtag: restaurant?.hashtag,
      score: score,
      isScrap: isScrap,
    };

    return data;
  } catch (error) {
    logger.e(error);
    throw error;
  }
};

export default {
  getRestaurantSummary,
};
