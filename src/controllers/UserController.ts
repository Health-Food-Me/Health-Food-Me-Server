import { Request, Response } from "express";
import message from "../modules/responseMessage";
import sc from "../modules/statusCode";
import util from "../modules/util";
import UserService from "../services";
import em from "../modules/exceptionMessage";
import jwt from "../modules/jwtHandler";

/**
 * @route POST /auth
 * @desc Authenticate user & Get token
 * @access Private
 */
const getUser = async (req: Request, res: Response) => {
  const social = req.body.social;
  const token = req.body.token;

  if (!social || !token) {
    return res
      .status(sc.UNAUTHORIZED)
      .send(util.fail(sc.UNAUTHORIZED, message.NULL_VALUE_TOKEN));
  }
  try {
    const email = await UserService.getUser(social, token);

    if (!email) {
      res
        .status(sc.UNAUTHORIZED)
        .send(util.fail(sc.UNAUTHORIZED, message.INVALID_TOKEN));
    }
    if (email === em.INVALID_USER) {
      res
        .status(sc.UNAUTHORIZED)
        .send(util.fail(sc.UNAUTHORIZED, message.UNAUTHORIZED_SOCIAL_USER));
    }

    const existUser = await UserService.findUserByEmail(email);
    if (!existUser) {
      const refreshToken = jwt.createRefresh();
      const newUser = await UserService.signUpUser(email, refreshToken);
      const accessToken = jwt.sign(newUser._id, newUser.email);

      const data = {
        user: newUser,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };

      return res
        .status(sc.OK)
        .send(util.success(sc.OK, message.SIGN_UP_SUCCESS, data));
    }

    const refreshToken = jwt.createRefresh();
    const accessToken = jwt.sign(existUser._id, existUser.email);

    await UserService.updateRefreshToken(existUser._id, refreshToken);

    const data = {
      user: existUser,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    return res
      .status(sc.OK)
      .send(util.success(sc.OK, message.SIGN_IN_SUCCESS, data));
  } catch (error) {
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(util.fail(sc.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

export default {
  getUser,
};
