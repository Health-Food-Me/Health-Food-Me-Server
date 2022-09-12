import { Request, Response } from "express";
import { logger } from "../config/winstonConfig";
import BaseResponse from "../modules/BaseResponse";
import message from "../modules/responseMessage";
import statusCode from "../modules/statusCode";
import ReviewService from "../services/ReviewService";
import ReveiwResponse from "../interface/review/ReviewResponseDto";

/**
 * @route GET /review/restaurant/:restaurantId
 * @desc 식당 리뷰 조회
 * @access Public
 */
const getReviewByRestaurant = async (req: Request, res: Response) => {
  const restaurantId: string = req.params.restaurantId;

  if (!restaurantId) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(BaseResponse.failure(statusCode.NOT_FOUND, message.NULL_VALUE));
  }

  try {
    const data = await ReviewService.getReviewsByRestaurant(restaurantId);

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
          message.READ_REVIEWS_BY_RESTAURANT,
          data,
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
 * @route GET /review/user/:userId
 * @desc 해당 유저가 쓴 리뷰 조회
 * @access Private
 */
const getReviewsByUser = async (req: Request, res: Response) => {
  const userId: string = req.params.userId;

  if (!userId) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(BaseResponse.failure(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  try {
    const data = await ReviewService.getReviewsByUser(userId);

    if (!data) {
      return res
        .status(statusCode.NOT_FOUND)
        .send(BaseResponse.failure(statusCode.NOT_FOUND, message.NOT_FOUND));
    }

    return res
      .status(statusCode.OK)
      .send(
        BaseResponse.success(statusCode.OK, message.READ_REVIEWS_BY_USER, data),
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

/**
 * @route DELETE /review/:reviewId
 * @desc 리뷰 삭제
 * @access Private
 */
const deleteReview = async (req: Request, res: Response) => {
  const reviewId = req.params.reviewId;

  if (!reviewId) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(BaseResponse.failure(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  try {
    const data = await ReviewService.deleteReview(reviewId);

    if (!data) {
      return res
        .status(statusCode.NOT_FOUND)
        .send(BaseResponse.failure(statusCode.NOT_FOUND, message.NOT_FOUND));
    }

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

/**
 * @route GET /review/:restaurantId/blog
 * @desc 네이버블로그 리뷰 조회
 * @access Public
 */
const getReviewsFromNaver = async (req: Request, res: Response) => {
  const restaurantId = req.params.restaurantId;

  if (!restaurantId) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(BaseResponse.failure(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  try {
    const data = await ReviewService.getReviewsFromNaver(restaurantId);

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
          message.READ_REVIEWS_FROM_NAVER,
          data,
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

type S3ImageInfo = {
  name: string;
  url: string;
};

/**
 * @route POST /review/:userId/:restaurantId
 * @desc 리뷰 작성
 * @access Private
 */
const createReview = async (req: Request, res: Response) => {
  const score = req.body.score;
  const taste = req.body.taste;
  const content = req.body.content;
  const images: Express.MulterS3.File[] = req.files as Express.MulterS3.File[];

  if (!score || !taste || !content) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(BaseResponse.failure(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  try {
    const imageList: S3ImageInfo[] = [];
    if (req.files) {
      const promises = images.map(async (image: Express.MulterS3.File) => {
        imageList.push({ name: image.originalname, url: image.location });
      });
      await Promise.all(promises);
    }

    const responseData: ReveiwResponse = {
      restaurantId: req.params.restaurantId,
      writerId: req.params.userId,
      reviewId: "",
      score: req.body.score,
      taste: req.body.taste,
      good: req.body.good,
      content: req.body.content,
      image: imageList,
      nameList: [],
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

/**
 * @route PUT /review/:reviewId
 * @desc 리뷰 수정
 * @access Private
 */
const updateReview = async (req: Request, res: Response) => {
  const reviewId = req.params.reviewId;
  const score = req.body.score;
  const taste = req.body.taste;
  const content = req.body.content;
  const images: Express.MulterS3.File[] = req.files as Express.MulterS3.File[];

  if (!score || !taste || !content) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(BaseResponse.failure(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  try {
    const imageList: S3ImageInfo[] = [];
    if (req.files) {
      const promises = images.map(async (image: Express.MulterS3.File) => {
        imageList.push({ name: image.originalname, url: image.location });
      });
      await Promise.all(promises);
    }

    let nameList = [];
    if (req.body.nameList) nameList = req.body.nameList;

    const responseData: ReveiwResponse = {
      restaurantId: "",
      writerId: "",
      reviewId: reviewId,
      score: req.body.score,
      taste: taste,
      good: req.body.good,
      content: req.body.content,
      image: imageList,
      nameList: nameList,
    };

    const data = await ReviewService.updateReview(responseData);

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
          message.UPDATE_REVIEW_SUCCESS,
          data,
        ),
      );
  } catch (error) {
    logger.e("ReviewController.updateReview error", error);
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
  getReviewsByUser,
  deleteReview,
  getReviewsFromNaver,
  updateReview,
};
