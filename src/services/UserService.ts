import { logger } from "../config/winstonConfig";
import User from "../models/User";
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
    const userCount = await User.count();

    const user = new User({
      name: `헬푸미${userCount + 1}`,
      social: social,
      socialId: socialId,
      email: email,
      scrapRestaurants: [],
      refreshToken: refreshToken,
    });

    await user.save();

    return user;
  } catch (error) {
    logger.error("", error);
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
    logger.error("", error);
    throw error;
  }
};

export default {
  getUser,
  findUserById,
  signUpUser,
  updateRefreshToken,
};
