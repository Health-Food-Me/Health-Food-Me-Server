import { Request, Response } from "express";
import { logger } from "../config/winstonConfig";
import { SocialUser } from "../interface/auth/SocialUser";
import BaseResponse from "../modules/BaseResponse";
import {
  default as em,
  default as exceptionMessage,
} from "../modules/exceptionMessage";
import jwt from "../modules/jwtHandler";
import message from "../modules/responseMessage";
import { default as sc, default as statusCode } from "../modules/statusCode";
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
      .status(sc.BAD_REQUEST)
      .send(BaseResponse.failure(sc.BAD_REQUEST, message.NULL_VALUE));
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
        .status(sc.CREATED)
        .send(
          BaseResponse.success(sc.CREATED, message.SIGN_UP_SUCCESS, await data),
        );
    }

    const refreshToken = jwt.createRefresh();
    const accessToken = jwt.sign(existUser._id, existUser.email);

    await UserService.updateRefreshToken(existUser._id, refreshToken);

    const data = {
      user: {
        _id: existUser._id,
        name: existUser.name,
        email: existUser.email,
      },
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
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
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

  try {
    const restaurantIds = await UserService.scrapRestaurant(
      userId,
      restaurantId,
    );

    if (!restaurantIds) {
      return res
        .status(statusCode.NOT_FOUND)
        .send(BaseResponse.failure(statusCode.NOT_FOUND, message.NOT_FOUND));
    }

    const data = { restaurants: restaurantIds };

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
 * @route GET /user/:userId/scraps
 * @desc 유저 스크랩 모아보기
 * @access Private
 */
const getUserScrapList = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const scrapList = await UserService.getUserScrapList(userId);

    if (!scrapList) {
      return res
        .status(statusCode.NOT_FOUND)
        .send(BaseResponse.failure(statusCode.NOT_FOUND, message.NOT_FOUND));
    }

    return res
      .status(statusCode.OK)
      .send(
        BaseResponse.success(
          statusCode.OK,
          message.READ_SCRAP_LIST_SUCCESS,
          scrapList,
        ),
      );
  } catch (error) {
    logger.e(error);
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

    if (user === exceptionMessage.DUPLICATE_NAME) {
      return res
        .status(statusCode.FORBIDDEN)
        .send(
          BaseResponse.failure(
            statusCode.FORBIDDEN,
            message.DUPLICATE_USER_NAME,
          ),
        );
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

  try {
    const result = await UserService.withdrawUser(userId);

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

/**
 * @route GET /review/check/:userId/:restaurantId
 * @desc 해당 식당에 해당 유저가 리뷰를 남긴 적이 있는가
 * @access Private
 */
const getHasReviewed = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const restaurantId = req.params.restaurantId;

  try {
    const hasReview = await UserService.hasReviewed(userId, restaurantId);

    const data = {
      hasReview: hasReview,
    };

    return res
      .status(statusCode.OK)
      .send(
        BaseResponse.success(statusCode.OK, message.CHECK_REVIEW_SUCCESS, data),
      );
  } catch (error) {
    logger.e("UserController.getHasReviewed", error);
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
  getUserScrapList,
  getUserProfile,
  updateUserProfile,
  withdrawUser,
  getHasReviewed,
};
