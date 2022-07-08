import { Request, Response } from "express";
import message from "../modules/responseMessage";
import sc from "../modules/statusCode";
import util from "../modules/util";
import UserService from "../services";
import em from "../modules/exceptionMessage";

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
    if (user === em.INVALID_USER) {
      res
        .status(sc.UNAUTHORIZED)
        .send(util.fail(sc.UNAUTHORIZED, message.UNAUTHORIZED_SOCIAL_USER));
    }
    return res
      .status(sc.OK)
      .send(util.success(sc.OK, message.SIGN_IN_SUCCESS, user));
  } catch (error) {
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(util.fail(sc.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

export default {
  getUser,
};
