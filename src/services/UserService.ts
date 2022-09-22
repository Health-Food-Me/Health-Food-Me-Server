import { Types } from "mongoose";
import { logger } from "../config/winstonConfig";
import ICategory from "../interface/restaurant/Category";
import { ScrapData } from "../interface/restaurant/ScrapData";
import UserProfile from "../interface/user/UserProfile";
import Restaurant from "../models/Restaurant";
import Review from "../models/Review";
import User from "../models/User";
import exceptionMessage from "../modules/exceptionMessage";
import randomName from "../modules/randomName";
import RestaurantService from "./RestaurantService";
import ReviewService from "./ReviewService";
import { authStrategy } from "./SocialAuthStrategy";

export type SocialPlatform = "kakao" | "naver" | "apple";

const getUser = async (social: SocialPlatform, accessToken: string) => {
  try {
    const user = await authStrategy[social].execute(accessToken);
    return user;
  } catch (error) {
    logger.e(error);
    throw error;
  }
};

const findUserById = async (userId: string, social: string, agent: string) => {
  try {
    const user = await User.findOne({
      social: social,
      socialId: userId,
    });

    if (!user) return null;

    await User.findByIdAndUpdate(user._id, { userAgent: agent });

    return user;
  } catch (error) {
    logger.e(error);
    if ((error as Error).message === "CastError") return null;
    throw error;
  }
};

const signUpUser = async (
  social: string,
  socialId: string,
  email: string,
  refreshToken: string,
  agent: string,
) => {
  try {
    let nickname = (await randomName.createRandomName()).toString();
    const existName = await User.find({
      name: {
        $regex: `.*${nickname}.*`,
      },
    });
    if (existName.length > 0) nickname = `${nickname}${existName.length + 1}`;

    const user = new User({
      name: nickname,
      social: social,
      socialId: socialId,
      email: email,
      scrapRestaurants: [],
      refreshToken: refreshToken,
      userAgent: agent,
    });

    await user.save();

    return user;
  } catch (error) {
    logger.e("", error);
    throw error;
  }
};

const updateRefreshToken = async (userId: string, refreshToken: string) => {
  try {
    await User.updateOne(
      { _id: userId },
      { $set: { refreshToken: refreshToken } },
    );
  } catch (error) {
    logger.e(error);
    if ((error as Error).message === "CastError") return null;
    throw error;
  }
};

const findUserByRfToken = async (refreshToken: string) => {
  try {
    const user = await User.findOne({
      refreshToken: refreshToken,
    });
    return user;
  } catch (error) {
    logger.e(error);
    if ((error as Error).message === "CastError") return null;
    throw error;
  }
};

const scrapRestaurant = async (userId: string, restaurantId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    let scraps = user.scrapRestaurants;
    let isScrap;

    if (!scraps) {
      const data = [];
      data.push(restaurantId);
      await User.findByIdAndUpdate(userId, {
        $set: { scrapRestaurants: data },
      });
      isScrap = true;
    }

    if (scraps.find((scrapId) => scrapId == restaurantId)) {
      scraps = scraps.filter((scrapId) => scrapId != restaurantId);
      await User.findByIdAndUpdate(userId, {
        $set: { scrapRestaurants: scraps },
      });
      isScrap = false;
    } else {
      scraps.push(restaurantId);
      await User.findByIdAndUpdate(userId, {
        $set: { scrapRestaurants: scraps },
      });
      isScrap = true;
    }

    const data = {
      userId: userId,
      restaurantId: restaurantId,
      isScrap: isScrap,
    };

    return data;
  } catch (error) {
    logger.e(error);
    if ((error as Error).message === "CastError") return null;
    throw error;
  }
};

const getUserScrapList = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const userScrap = user.scrapRestaurants;
    if (!userScrap) return [];

    const scrapList: ScrapData[] = [];

    const promises = userScrap.map(async (restaurantId) => {
      const restaurant = await Restaurant.findById(restaurantId).populate<{
        category: ICategory[];
      }>("category");

      if (restaurant) {
        const categories: string[] = [];
        const categoryPromises = restaurant.category.map(async (category) => {
          categories.push(category.title);
        });
        await Promise.all(categoryPromises);

        const score = await RestaurantService.getScore(
          restaurant.review as Types.ObjectId[],
        );

        const address = (restaurant.address as string).split(" ");

        const data: ScrapData = {
          _id: restaurant._id,
          name: restaurant.name as string,
          logo: restaurant.logo as string,
          score: score,
          category: categories,
          latitude: restaurant.location.coordinates.at(1) as number,
          longtitude: restaurant.location.coordinates.at(0) as number,
          address: `${address[0]} ${address[1]}`,
        };
        scrapList.push(data);
      }
    });
    await Promise.all(promises);

    return scrapList;
  } catch (error) {
    logger.e(error);
    if ((error as Error).name === "CastError") return null;
    throw error;
  }
};

const getUserProfile = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (user == undefined) return null;

    const data: UserProfile = {
      _id: userId,
      name: user.name,
    };

    return "data";
  } catch (error) {
    logger.e(error);
    if ((error as Error).message === "CastError") return null;
    throw error;
  }
};

const updateUserProfile = async (userId: string, name: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const userName = await User.findOne({ name: name });
    if (userName) return exceptionMessage.DUPLICATE_NAME;

    const result = await User.findByIdAndUpdate(
      userId,
      { $set: { name: name } },
      { new: true },
    );
    if (!result) return null;

    const data: UserProfile = {
      _id: result._id,
      name: result.name,
    };

    return data;
  } catch (error) {
    logger.e(error);
    if ((error as Error).message === "CastError") return null;
    throw error;
  }
};

const withdrawUser = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const reviews = user.reviews;

    const promises = reviews.map(async (reviewId) => {
      const result = await ReviewService.deleteReview(String(reviewId));
      if (!result) {
        await Review.findByIdAndDelete(reviewId);
      }
    });
    await Promise.all(promises);

    await User.findByIdAndDelete(userId);

    return exceptionMessage.DELETE_USER;
  } catch (error) {
    logger.e(error);
    if ((error as Error).message === "CastError") return null;
    throw error;
  }
};

const hasReviewed = async (userId: string, restaurantId: string) => {
  try {
    const user = await User.findById(userId);
    const restaurant = await Restaurant.findById(restaurantId);

    if (!user || !restaurant) return null;

    const review = await Review.findOne({
      writer: userId,
      restaurant: restaurantId,
    });

    let hasReview;
    if (review) hasReview = true;
    else hasReview = false;

    const data = {
      hasReview: hasReview,
    };

    return data;
  } catch (error) {
    logger.e(error);
    throw error;
  }
};

const updateAgent = async (userId: string, agent: string) => {
  try {
    const user = await User.findByIdAndUpdate(userId, {
      userAgent: agent,
    });
    return user;
  } catch (error) {
    logger.e(error);
    throw error;
  }
};

export default {
  getUser,
  findUserById,
  signUpUser,
  updateRefreshToken,
  findUserByRfToken,
  scrapRestaurant,
  getUserScrapList,
  getUserProfile,
  updateUserProfile,
  withdrawUser,
  hasReviewed,
  updateAgent,
};
