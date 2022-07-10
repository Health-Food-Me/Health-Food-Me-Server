import jwt, { JsonWebTokenError } from "jsonwebtoken";
import mongoose from "mongoose";
import config from "../config";
import { logger } from "../config/winstonConfig";
import em from "./exceptionMessage";

const sign = (userId: mongoose.Schema.Types.ObjectId, email: string) => {
  const payload = {
    id: userId,
    email: email,
  };

  const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });
  return accessToken;
};

const createRefresh = () => {
  const refreshToken = jwt.sign({}, config.jwtSecret, { expiresIn: "14d" });
  return refreshToken;
};

const verify = (token: string) => {
  let decoded;
  try {
    decoded = jwt.verify(token, config.jwtSecret);
  } catch (error: unknown) {
    if (isJsonWeboTokenError(error)) {
      if (error.message === "jwt expired") {
        logger.e("만료된 토큰입니다.");
        return em.TOKEN_EXPIRED;
      }
      if (error.message === "invalid signature") {
        logger.e("유효하지 않은 토큰입니다.");
        return em.TOKEN_INVALID;
      }
      logger.e("유효하지 않은 토큰입니다.");
    }

    return em.TOKEN_INVALID;
  }

  return decoded;
};

declare function isJsonWeboTokenError(x: unknown): x is JsonWebTokenError;

export default {
  sign,
  createRefresh,
  verify,
};
