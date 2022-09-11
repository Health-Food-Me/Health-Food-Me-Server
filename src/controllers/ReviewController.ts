import { Request, Response } from "express";
import { logger } from "../config/winstonConfig";
import Review from "../models/Review";
import BaseResponse from "../modules/BaseResponse";
import message from "../modules/responseMessage";
import statusCode from "../modules/statusCode";
import ReviewService from "../services/ReviewService";
import ReveiwResponse from "../interface/review/ReviewResponseDto";

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
      const promises = images.map((image: Express.MulterS3.File) => {
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
  const review = await Review.findById(reviewId);
  if (review == undefined) return null;

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
    let imageList: {
      name: string;
      url: string;
    }[];
    if (req.files) {
      imageList = await Promise.all(
        images.map((image: Express.MulterS3.File) => {
          return { name: image.originalname, url: image.location };
        }),
      );
    } else {
      imageList = [];
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
