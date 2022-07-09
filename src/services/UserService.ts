import { logger } from "../config/winstonConfig";
import auth from "../config/auth";
import User from "../models/User";

const getUser = async (social: string, accessToken: string) => {
  try {
    let email;
    switch (social) {
      case "naver":
        email = await auth.naverAuth(accessToken);
        break;
      case "kakao":
        email = await auth.kakaoAuth(accessToken);
        break;
      case "apple":
        email = await auth.appleAuth(accessToken);
        break;
    }
    return email;
  } catch (error) {
    logger.error("", error);
    throw error;
  }
};

const findUserByEmail = async (email: string) => {
  try {
    const user = await User.findOne({
      email: email,
    });
    return user;
  } catch (error) {
    logger.error("", error);
    throw error;
  }
};

const signUpUser = async (email: string, refreshToken: string) => {
  try {
    const userCount = await User.count();

    const user = new User({
      name: `헬푸미${userCount + 1}`,
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
  findUserByEmail,
  signUpUser,
  updateRefreshToken,
};
