import { Request, Response } from "express";
import { logger } from "../config/winstonConfig";
import { SocialUser } from "../interface/SocialUser";
import BaseResponse from "../modules/BaseResponse";
import em from "../modules/exceptionMessage";
import jwt from "../modules/jwtHandler";
import message from "../modules/responseMessage";
import statusCode from "../modules/statusCode";
import sc from "../modules/statusCode";
import UserService from "../services/UserService";

/**
 * @route POST /auth
 * @desc Authenticate user & Get token
 * @access Private
 */
const getUser = async (req: Request, res: Response) => {
  const social = req.body.social;
  const token = req.body.token;

  if (!social || !token) {
    return res
      .status(sc.UNAUTHORIZED)
      .send(BaseResponse.failure(sc.UNAUTHORIZED, message.NULL_VALUE_TOKEN));
  }
  try {
    const user = await UserService.getUser(social, token);

    if (!user) {
      return res
        .status(sc.UNAUTHORIZED)
        .send(BaseResponse.failure(sc.UNAUTHORIZED, message.INVALID_TOKEN));
    }
    if (user === em.INVALID_USER) {
      return res
        .status(sc.UNAUTHORIZED)
        .send(
          BaseResponse.failure(
            sc.UNAUTHORIZED,
            message.UNAUTHORIZED_SOCIAL_USER,
          ),
        );
    }

    const existUser = await UserService.findUserById(
      (user as SocialUser).userId,
      social,
    );
    if (!existUser) {
      const data = createUser(social, user);

      return res
        .status(sc.OK)
        .send(BaseResponse.success(sc.OK, message.SIGN_UP_SUCCESS, await data));
    }

    const refreshToken = jwt.createRefresh();
    const accessToken = jwt.sign(existUser._id, existUser.email);

    await UserService.updateRefreshToken(existUser._id, refreshToken);

    const data = {
      user: existUser,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    return res
      .status(sc.OK)
      .send(BaseResponse.success(sc.OK, message.SIGN_IN_SUCCESS, data));
  } catch (error) {
    logger.e("UserController getUser error", error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(
        BaseResponse.failure(
          sc.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR,
        ),
      );
  }
};

async function createUser(social: string, user: SocialUser) {
  const refreshToken = jwt.createRefresh();
  const newUser = await UserService.signUpUser(
    social,
    (user as SocialUser).userId,
    (user as SocialUser).email,
    refreshToken,
  );
  const accessToken = jwt.sign(newUser._id, newUser.email);

  return {
    user: newUser,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
}

/**
 * @route PUT /user/:userId/scrap/:restaurantId
 * @desc User's scraping the restaurant
 * @access Private
 */
const scrapRestaurant = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const restaurantId = req.params.restaurantId;

  if (!userId || !restaurantId) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(BaseResponse.failure(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  try {
    const isScrap = await UserService.scrapRestaurant(userId, restaurantId);

    const data = { isScrap: isScrap };

    return res
      .status(statusCode.OK)
      .send(
        BaseResponse.success(statusCode.OK, message.UPDATE_SCRAP_SUCCESS, data),
      );
  } catch (error) {
    logger.e("UserController.scrapRestaurant error", error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        BaseResponse.failure(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR,
        ),
      );
  }
};

/**
 * @route GET /user/:userId/profile
 * @desc Get User Profile
 * @access Private
 */
const getUserProfile = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  if (!userId) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(BaseResponse.failure(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  try {
    const userProfile = await UserService.getUserProfile(userId);

    if (!userProfile) {
      return res
        .status(statusCode.NOT_FOUND)
        .send(BaseResponse.failure(statusCode.NOT_FOUND, message.NOT_FOUND));
    }

    return res
      .status(statusCode.OK)
      .send(
        BaseResponse.success(
          statusCode.OK,
          message.READ_USER_PROFILE_SUCCESS,
          userProfile,
        ),
      );
  } catch (error) {
    logger.e("UserController.getUserProfile error", error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        BaseResponse.failure(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR,
        ),
      );
  }
};

/**
 * @route PUT /user/:userId/profile
 * @desc Update User Profile
 * @access Private
 */
const updateUserProfile = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const userName = req.body.name;

  if (!userId || !userName) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(BaseResponse.failure(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  try {
    const user = await UserService.updateUserProfile(userId, userName);

    if (!user) {
      return res
        .status(statusCode.NOT_FOUND)
        .send(BaseResponse.failure(statusCode.NOT_FOUND, message.NOT_FOUND));
    }

    return res
      .status(statusCode.OK)
      .send(
        BaseResponse.success(
          statusCode.OK,
          message.UPDATE_USER_PROFILE_SUCCESS,
          user,
        ),
      );
  } catch (error) {
    logger.e("UserController.updateUserProfile error", error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        BaseResponse.failure(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR,
        ),
      );
  }
};

/**
 * @route DELETE /auth/withdrawal/:userId
 * @desc User Withdrawal
 * @access Private
 */
const withdrawUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  if (!userId) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(BaseResponse.failure(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  try {
    const result = await UserService.destroyUser(userId);

    if (!result) {
      return res
        .status(statusCode.NOT_FOUND)
        .send(BaseResponse.failure(statusCode.NOT_FOUND, message.NOT_FOUND));
    }

    return res
      .status(statusCode.OK)
      .send(BaseResponse.success(statusCode.OK, message.DELETE_USER_SUCCESS));
  } catch (error) {
    logger.e("UserController.destroyUser error", error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        BaseResponse.failure(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR,
        ),
      );
  }
};

export default {
  getUser,
  scrapRestaurant,
  getUserProfile,
  updateUserProfile,
  withdrawUser,
};
