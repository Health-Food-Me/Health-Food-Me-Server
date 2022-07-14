import { Request, Response } from "express";
import { logger } from "../config/winstonConfig";
import BaseResponse from "../modules/BaseResponse";
import message from "../modules/responseMessage";
import statusCode from "../modules/statusCode";
import RestaurantService from "../services/RestaurantService";

/**
 * @route GET /restaurant/:restaurantId/:userId
 * @desc 식당 카드의 요약 정보를 호출
 * @access Private
 */
const getRestaurantSummary = async (req: Request, res: Response) => {
  const { restaurantId, userId } = req.params;

  try {
    const restaurant = await RestaurantService.getRestaurantSummary(
      restaurantId,
      userId,
    );

    if (!restaurant) {
      return res
        .status(statusCode.NOT_FOUND)
        .send(BaseResponse.failure(statusCode.NOT_FOUND, message.NOT_FOUND));
    }

    return res
      .status(statusCode.OK)
      .send(
        BaseResponse.success(
          statusCode.OK,
          message.READ_RESTAURANT_SUMMARY_SUCCESS,
          restaurant,
        ),
      );
  } catch (error) {
    logger.e("RestaurantController.getRestaurantSummary error", error);
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
 * @route GET /restaurant/:restaurantId/menus
 * @desc Restaurant's menu detail
 * @access Private
 */
const getMenuDetail = async (req: Request, res: Response) => {
  const restaurantId = req.params.restaurantId;
  const latitude = req.query.latitude;
  const longtitude = req.query.longtitude;

  if (!restaurantId) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(BaseResponse.failure(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  try {
    const data = await RestaurantService.getMenuDetail(
      restaurantId,
      Number(latitude),
      Number(longtitude),
    );

    return res
      .status(statusCode.OK)
      .send(
        BaseResponse.success(
          statusCode.OK,
          message.READ_RESTAURANT_MENU_SUCCESS,
          data,
        ),
      );
  } catch (error) {
    logger.e("RestaurantController.getMenuDetail error", error);
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
 * @route GET /restaurant?longitude=number&latitude=number&zoom=number
 * @desc 식당 카드의 요약 정보를 호출
 * @access Private
 */
const getAroundRestaurants = async (req: Request, res: Response) => {
  const longitude = req.query.longitude;
  const latitude = req.query.latitude;
  const zoom = req.query.zoom;

  if (!longitude && !latitude && !zoom) {
    res
      .status(statusCode.BAD_REQUEST)
      .send(
        BaseResponse.failure(statusCode.BAD_REQUEST, message.NULL_VALUE_PARAM),
      );
  }

  try {
    const restaurants = await RestaurantService.getAroundRestaurants(
      Number(longitude),
      Number(latitude),
      Number(zoom),
    );

    if (!restaurants) {
      return res
        .status(statusCode.NO_CONTENT)
        .send(
          BaseResponse.success(
            statusCode.NO_CONTENT,
            message.READ_AROUND_RESTAURANT_SUCCESS,
          ),
        );
    }

    return res
      .status(statusCode.OK)
      .send(
        BaseResponse.success(
          statusCode.OK,
          message.READ_AROUND_RESTAURANT_SUCCESS,
          restaurants,
        ),
      );
  } catch (error) {
    logger.e("RestaurantController.getAroundRestaurants error", error);
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
 * @route GET /restaurant/:restaurantId/prescription
 * @desc 외식 대처법 정보 조회
 * @access Private
 */
const getPrescription = async (req: Request, res: Response) => {
  const restaurantId = req.params.restaurantId;

  if (!restaurantId) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(BaseResponse.failure(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  try {
    const prescription = await RestaurantService.getPrescription(restaurantId);

    if (!prescription) {
      return res
        .status(statusCode.NOT_FOUND)
        .send(BaseResponse.failure(statusCode.NOT_FOUND, message.NOT_FOUND));
    }

    return res
      .status(statusCode.OK)
      .send(
        BaseResponse.success(
          statusCode.OK,
          message.READ_PRESCRIPTION_SUCCESS,
          prescription,
        ),
      );
  } catch (error) {
    logger.e("RestaurantController.getPrescription error", error);
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
  getRestaurantSummary,
  getMenuDetail,
  getAroundRestaurants,
  getPrescription,
};
