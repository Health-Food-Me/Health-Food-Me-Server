import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { Types } from "mongoose";
import config from "../config";
import { logger } from "../config/winstonConfig";
import em from "./exceptionMessage";

const sign = (userId: Types.ObjectId, email: string) => {
  const payload = {
    id: userId,
    email: email,
  };

  let validityDate = "3d";
  if (process.env.NODE_ENV === "production") {
    validityDate = "1h";
  }
  const accessToken = jwt.sign(payload, config.jwtSecret, {
    expiresIn: validityDate,
  });
  return accessToken;
};

const createRefresh = () => {
  const refreshToken = jwt.sign({}, config.jwtSecret, { expiresIn: "14d" });
  return refreshToken;
};

const verify = (token: string) => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    return decoded;
  } catch (error) {
    if ((error as JsonWebTokenError).message === "jwt expired") {
      logger.e("만료된 토큰입니다.", error);
      return em.TOKEN_EXPIRED;
    }
    if ((error as JsonWebTokenError).message === "invalid signature") {
      logger.e("유효하지 않은 토큰입니다.", error);
      return em.TOKEN_INVALID;
    }
    logger.e("유효하지 않은 토큰입니다.", error);

    return em.TOKEN_INVALID;
  }
};

export default {
  sign,
  createRefresh,
  verify,
};
