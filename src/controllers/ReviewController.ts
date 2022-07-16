import e, { Request, Response } from "express";
import { validationResult } from "express-validator";
import { logger } from "../config/winstonConfig";
import Restaurant from "../models/Restaurant";
import BaseResponse from "../modules/BaseResponse";
import message from "../modules/responseMessage";
import statusCode from "../modules/statusCode";
import ReviewService from "../services/ReviewService";
import ReveiwResponseDto from "./dto/review/ReviewResponseDto";

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

/**
 * @route POST /review/user/:userId/restaurant/:restaurantId
 * @desc 리뷰 작성
 * @access Private
 */
const createReview = async (req: Request, res: Response) => {
  const score = req.body.score;
  const hashtag = req.body.hashtag;
  const content = req.body.content;
  const images: Express.MulterS3.File[] = req.files as Express.MulterS3.File[];

  if (!score || !hashtag || !content) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(BaseResponse.failure(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }
  
  try {
    let imageList: string[];
    if (req.files) {
      imageList = await Promise.all(images.map((image: Express.MulterS3.File) => {
        return image.location
      }));
    } else {
      imageList = [];
    }

    const responseData: ReveiwResponseDto = {
      restaurantId: req.params.restaurantId,
      writerId: req.params.userId,
      score: req.body.score,
      hashtag: req.body.hashtag,
      content: req.body.content,
      image: imageList,
    };

    const data = await ReviewService.createReview(responseData);

    if (!data) {
      return res
        .status(statusCode.NOT_FOUND)
        .send(BaseResponse.failure(statusCode.NOT_FOUND, message.NOT_FOUND));
    }

    return res
      .status(statusCode.OK)
      .send(
        BaseResponse.success(
          statusCode.OK,
          message.CREATE_REVIEW_SUCCESS,
          data,
        ),
      );
  } catch (error) {
    logger.e("ReviewController.createReview error", error);
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
  createReview,
};
