import { Request, Response } from "express";
import { logger } from "../config/winstonConfig";
import BaseResponse from "../modules/BaseResponse";
import message from "../modules/responseMessage";
import statusCode from "../modules/statusCode";
import RestaurantService from "../services/RestaurantService";

/**
 * @route GET /restaurant/:restaurantId
 * @desc 식당 카드의 요약 정보를 호출
 * @access Private
 */
const getRestaurantSummary = async (req: Request, res: Response) => {
  const restaurantId = req.params.restaurantId;
  const userId = req.params.userId;

  if (!restaurantId || !userId) {
    res
      .status(statusCode.BAD_REQUEST)
      .send(
        BaseResponse.failure(statusCode.BAD_REQUEST, message.NULL_VALUE_PARAM),
      );
  }

  try {
    const restaurant = await RestaurantService.getRestaurantSummary(
      restaurantId,
      userId,
    );

    if (!restaurant) {
      return res
        .status(statusCode.NO_CONTENT)
        .send(
          BaseResponse.success(
            statusCode.NO_CONTENT,
            message.READ_RESTAURANT_SUMMARY_SUCCESS,
          ),
        );
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

export default {
  getRestaurantSummary,
  getAroundRestaurants,
};
