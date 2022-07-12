import { Request, Response } from "express";
import { SocialUserInfo } from "../interfaces/SocialUserInfo";
import em from "../modules/exceptionMessage";
import jwt from "../modules/jwtHandler";
import message from "../modules/responseMessage";
import sc from "../modules/statusCode";
import BaseResponse from "../modules/BaseResponse";
import UserService from "../services";
import { logger } from "../config/winstonConfig";

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
      .send(BaseResponse.failure(sc.UNAUTHORIZED, message.NULL_VALUE_TOKEN));
  }
  try {
    const user = await UserService.getUser(social, token);

    if (!user) {
      return res
        .status(sc.UNAUTHORIZED)
        .send(BaseResponse.failure(sc.UNAUTHORIZED, message.INVALID_TOKEN));
    }
    if (user === em.INVALID_USER) {
      return res
        .status(sc.UNAUTHORIZED)
        .send(
          BaseResponse.failure(
            sc.UNAUTHORIZED,
            message.UNAUTHORIZED_SOCIAL_USER,
          ),
        );
    }

    const existUser = await UserService.findUserById(
      (user as SocialUserInfo).userId,
      social,
    );
    if (!existUser) {
      const data = createUser(social, user);

      return res
        .status(sc.OK)
        .send(util.success(sc.OK, message.SIGN_UP_SUCCESS, await data));
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
      .send(BaseResponse.success(sc.OK, message.SIGN_IN_SUCCESS, data));
  } catch (error) {
    logger.e("UserController getUser error", error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(
        BaseResponse.failure(
          sc.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR,
        ),
      );
  }
};

async function createUser(social: string, user: SocialUserInfo) {
  const refreshToken = jwt.createRefresh();
  const newUser = await UserService.signUpUser(
    social,
    (user as SocialUserInfo).userId,
    (user as SocialUserInfo).email,
    refreshToken,
  );
  const accessToken = jwt.sign(newUser._id, newUser.email);

  return {
    user: newUser,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
}

export default {
  getUser,
};
