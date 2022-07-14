import { logger } from "../config/winstonConfig";
import User from "../models/User";
import exceptionMessage from "../modules/exceptionMessage";
import { authStrategy } from "./SocialAuthStrategy";
import UserProfileDto from "../interface/UserProfile";
import RestaurantService from "./RestaurantService";
import { ScrapData } from "../interface/ScrapData";

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

const findUserById = async (userId: string, social: string) => {
  try {
    const user = await User.findOne({
      social: social,
      socialId: userId,
    });
    return user;
  } catch (error) {
    logger.e(error);
    throw error;
  }
};

const signUpUser = async (
  social: string,
  socialId: string,
  email: string,
  refreshToken: string,
) => {
  try {
    let user;
    if (!email) {
      user = new User({
        name: `헬푸미${socialId}`,
        social: social,
        socialId: socialId,
        scrapRestaurants: [],
        refreshToken: refreshToken,
      });
    } else {
      user = new User({
        name: `헬푸미${socialId}`,
        social: social,
        socialId: socialId,
        email: email,
        scrapRestaurants: [],
        refreshToken: refreshToken,
      });
    }

    console.log(user);

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
    throw error;
  }
};

const scrapRestaurant = async (userId: string, restaurantId: string) => {
  const user = await User.findById(userId);
  let scraps = user?.scrapRestaurants;

  if (scraps?.find((x) => x == restaurantId)) {
    scraps = scraps.filter((restaurantId) => restaurantId !== restaurantId);
    await User.findByIdAndUpdate(userId, {
      $set: { scrapRestaurants: scraps },
    });
    return false;
  } else {
    scraps?.push(restaurantId);
    await User.findByIdAndUpdate(userId, {
      $set: { scrapRestaurants: scraps },
    });
    return true;
  }
};

const getUserScrpaList = async (userId: string) => {
  const user = await User.findById(userId);
  const userScrap = user?.scrapRestaurants;

  const scrapList: ScrapData[] = [];
  if (userScrap !== undefined) {
    const promise = userScrap.map(async (restaurantId) => {
      const restaurant = await RestaurantService.getRestaurantSummary(
        restaurantId,
        userId,
      );

      const data: ScrapData = {
        _id: restaurant._id,
        name: restaurant.name as string,
        logo: restaurant.logo as string,
        score: restaurant.score as number,
        category: restaurant.category as string,
      };
      scrapList.push(data);
    });
    await Promise.all(promise);
  }

  return scrapList;
};

const getUserProfile = async (userId: string) => {
  try {
    const user = await User.findById(userId);

    const data: UserProfileDto = {
      _id: userId,
      name: user?.name as string,
    };

    return data;
  } catch (error) {
    logger.e(error);
    throw error;
  }
};

const updateUserProfile = async (userId: string, name: string) => {
  try {
    let user = await User.findById(userId);
    if (!user) {
      return null;
    }

    const userName = await User.findOne({ name: name });
    if (userName) {
      return exceptionMessage.DUPLICATE_NAME;
    }

    await User.findByIdAndUpdate(userId, {
      $set: { name: name },
    });

    user = await User.findById(userId);

    const data: UserProfileDto = {
      _id: userId,
      name: user?.name as string,
    };

    return data;
  } catch (error) {
    logger.e(error);
    throw error;
  }
};

const withdrawUser = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return null;
    }

    await User.findByIdAndDelete(userId);
    return exceptionMessage.DELETE_USER;
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
  getUserScrpaList,
  getUserProfile,
  updateUserProfile,
  withdrawUser,
};
