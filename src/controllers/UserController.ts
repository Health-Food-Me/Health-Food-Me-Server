import express, { Request, Response } from "express";
import { logger } from "../config/winstonConfig";
import message from "../modules/responseMessage";
import sc from "../modules/statusCode";
import util from "../modules/util";
import UserService from "../services";

/**
 * @route POST /auth
 * @desc Authenticate user & Get token
 * @access Private
 */
const getUser = async (req: Request, res: Response) => {
  const social = req.body.social;
  const accessToken = req.body.token;

  if (!social || !accessToken) {
    return res
      .status(sc.UNAUTHORIZED)
      .send(util.fail(sc.UNAUTHORIZED, message.NULL_VALUE_TOKEN));
  }
  try {
    const user = await UserService.getUser(social, accessToken);
    if (!user) {
      res
        .status(sc.UNAUTHORIZED)
        .send(util.fail(sc.UNAUTHORIZED, message.INVALID_TOKEN));
    }
    return res
      .status(sc.OK)
      .send(util.success(sc.OK, message.SIGN_IN_SUCCESS, user));
  } catch (error: any) {
    logger.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(util.fail(sc.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

export default {
  getUser,
};
