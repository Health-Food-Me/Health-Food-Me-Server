import { logger } from "../config/winstonConfig";
import AroundRestaurantDto from "../controllers/dto/restaurant/AroundRestaurantDto";
import ICategory from "../interface/Category";
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
      const promises = reviews.map(async (reviewId) => {
        review = await Review.findById(reviewId);
        score = score + (review as IReview).score;
      });
      await Promise.all(promises);

      if (reviews.length > 0) {
        score = Number((score / reviews.length).toFixed(1));
      }
    }

    let isScrap = false;
    if (scraps?.find((x) => x == restaurantId) !== undefined) {
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

const getAroundRestaurants = async (
  longitude: number,
  latitude: number,
  zoom: number,
) => {
  try {
    const restaurants = await Restaurant.find({
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: zoom,
      },
    }).populate<{ category: ICategory }>("category");
    const results: AroundRestaurantDto[] = restaurants.map((restaurant) => {
      return {
        _id: restaurant._id as string,
        name: restaurant.name,
        longitude: restaurant.location.coordinates.at(1),
        latitude: restaurant.location.coordinates.at(0),
        isDietRestaurant: restaurant.category.isDiet,
      };
    });
    return results;
  } catch (error) {
    logger.e(error);
    throw error;
  }
};

export default {
  getRestaurantSummary,
  getAroundRestaurants,
};
