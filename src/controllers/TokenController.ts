import { Request, Response } from "express";
import { logger } from "../config/winstonConfig";
import BaseResponse from "../modules/BaseResponse";
import exceptionMessage from "../modules/exceptionMessage";
import jwt from "../modules/jwtHandler";
import message from "../modules/responseMessage";
import statusCode from "../modules/statusCode";
import UserService from "../services/UserService";

/**
 * @route GET /auth/token
 * @desc Get new access token by refresh token
 * @access private
 */
const getToken = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken;
  const refreshToken = req.headers.refreshtoken;

  if (!accessToken || !refreshToken) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(
        BaseResponse.failure(statusCode.BAD_REQUEST, message.NULL_VALUE_TOKEN),
      );
  }

  try {
    const access = jwt.verify(accessToken as string);
    let data;

    if (access === exceptionMessage.TOKEN_INVALID) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(
          BaseResponse.failure(statusCode.UNAUTHORIZED, message.INVALID_TOKEN),
        );
    }

    if (access === exceptionMessage.TOKEN_EXPIRED) {
      const refresh = jwt.verify(refreshToken as string);

      if (refresh === exceptionMessage.TOKEN_INVALID) {
        return res
          .status(statusCode.UNAUTHORIZED)
          .send(
            BaseResponse.failure(
              statusCode.UNAUTHORIZED,
              message.INVALID_TOKEN,
            ),
          );
      }

      if (refresh === exceptionMessage.TOKEN_EXPIRED) {
        return res
          .status(statusCode.UNAUTHORIZED)
          .send(
            BaseResponse.failure(
              statusCode.UNAUTHORIZED,
              message.EXPIRED_TOKEN,
            ),
          );
      }

      const user = await UserService.findUserByRfToken(refreshToken as string);
      if (!user) {
        return res
          .status(statusCode.UNAUTHORIZED)
          .send(
            BaseResponse.failure(
              statusCode.UNAUTHORIZED,
              message.INVALID_TOKEN,
            ),
          );
      }

      data = {
        accessToken: jwt.sign(user._id, user.email),
        refreshToken: refreshToken,
      };

      return res
        .status(statusCode.OK)
        .send(
          BaseResponse.success(
            statusCode.OK,
            message.CREATE_TOKEN_SUCCESS,
            data,
          ),
        );
    }
    return res
      .status(statusCode.OK)
      .send(
        BaseResponse.success(statusCode.OK, message.CREATE_TOKEN_SUCCESS, data),
      );
  } catch (error) {
    logger.e("TokenController getToken error: ", error);
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

export default { getToken };
