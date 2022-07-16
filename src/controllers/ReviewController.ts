import { Request, Response } from "express";
import { logger } from "../config/winstonConfig";
import BaseResponse from "../modules/BaseResponse";
import message from "../modules/responseMessage";
import statusCode from "../modules/statusCode";
import ReviewService from "../services/ReviewService";

/**
 * @route GET /review/restaurant/:restaurantId
 * @desc 식당 리뷰 조회
 * @access Private
 */
const getReviewByRestaurant = async (req: Request, res: Response) => {
  const restaurantId: string = req.params.restaurantId;

  if (!restaurantId) {
    return res
      .status(statusCode.NOT_FOUND)
      .send(BaseResponse.failure(statusCode.NOT_FOUND, message.NOT_FOUND));
  }

  try {
    const reviews = await ReviewService.getReviewsByRestaurant(restaurantId);
    return res
      .status(statusCode.OK)
      .send(
        BaseResponse.success(
          statusCode.OK,
          message.READ_REVIEWS_BY_RESTAURANT,
          reviews,
        ),
      );
  } catch (error) {
    logger.e(`Review getReviewByRestaurant ${error}`);
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

const getReviewsByUser = async (req: Request, res: Response) => {
  const userId: string = req.params.userId;

  if (!userId) {
    return res
      .status(statusCode.NOT_FOUND)
      .send(BaseResponse.failure(statusCode.NOT_FOUND, message.NOT_FOUND));
  }

  try {
    const reviews = await ReviewService.getReviewsByUser(userId);
    return res
      .status(statusCode.OK)
      .send(
        BaseResponse.success(
          statusCode.OK,
          message.READ_REVIEWS_BY_USER,
          reviews,
        ),
      );
  } catch (error) {
    logger.e(`Review getReviewsByUser ${error}`);
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

const deleteReview = async (req: Request, res: Response) => {
  const reviewId = req.params.reviewId;

  if (!reviewId) {
    return res
      .status(statusCode.NOT_FOUND)
      .send(BaseResponse.failure(statusCode.NOT_FOUND, message.NOT_FOUND));
  }

  try {
    await ReviewService.deleteReview(reviewId);
    return res
      .status(statusCode.OK)
      .send(BaseResponse.success(statusCode.OK, message.DELETE_REVIEW));
  } catch (error) {
    logger.e(`Review deleteReview ${error}`);
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

const getReviewsFromNaver = async (req: Request, res: Response) => {
  const name = req.params.name;

  if (!name) {
    return res
      .status(statusCode.NOT_FOUND)
      .send(BaseResponse.failure(statusCode.NOT_FOUND, message.NOT_FOUND));
  }

  try {
    const blogReviews = await ReviewService.getReviewsFromNaver(name);
    return res
      .status(statusCode.OK)
      .send(
        BaseResponse.success(
          statusCode.OK,
          message.READ_REVIEWS_FROM_NAVER,
          blogReviews,
        ),
      );
  } catch (error) {
    logger.e(`Review getReviewsFromNaver ${error}`);
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
  getReviewByRestaurant,
  getReviewsByUser,
  deleteReview,
  getReviewsFromNaver,
};
