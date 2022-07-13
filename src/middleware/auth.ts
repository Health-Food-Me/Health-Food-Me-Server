import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { logger } from "../config/winstonConfig";
import User from "../models/User";
import BaseResponse from "../modules/BaseResponse";
import exceptionMessage from "../modules/exceptionMessage";
import jwt from "../modules/jwtHandler";
import message from "../modules/responseMessage";
import statusCode from "../modules/statusCode";

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.token;

  if (!token) {
    return res
      .status(statusCode.UNAUTHORIZED)
      .send(
        BaseResponse.failure(statusCode.UNAUTHORIZED, message.NULL_VALUE_TOKEN),
      );
  }

  try {
    const decoded = jwt.verify(token as string);
    if (decoded === exceptionMessage.TOKEN_EXPIRED) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(
          BaseResponse.failure(statusCode.UNAUTHORIZED, message.EXPIRED_TOKEN),
        );
    }
    if (decoded === exceptionMessage.TOKEN_INVALID) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(
          BaseResponse.failure(statusCode.UNAUTHORIZED, message.INVALID_TOKEN),
        );
    }

    const userId = (decoded as JwtPayload).id;
    if (!userId) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(
          BaseResponse.failure(statusCode.UNAUTHORIZED, message.INVALID_TOKEN),
        );
    }
    const user = User.findById(userId);
    if (!user) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(BaseResponse.failure(statusCode.UNAUTHORIZED, message.NO_USER));
    }

    req.body.user = user;

    next();
  } catch (error) {
    logger.e("middleware/auth.ts error", error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        BaseResponse.failure(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR,
        ),
      );
  }
};
