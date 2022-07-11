import axios from "axios";
import jwt from "jsonwebtoken";
import { SocialUserInfo } from "../interfaces/SocialUserInfo";
import execptionMessage from "../modules/exceptionMessage";
import { logger } from "./winstonConfig";

const naverAuth = async (naverAccessToken: string) => {
  try {
    const user = await axios({
      method: "get",
      url: "https://openapi.naver.com/v1/nid/me",
      headers: {
        Authorization: `Bearer ${naverAccessToken}`,
      },
    });

    const userId = user.data.response.id;

    if (!userId) return execptionMessage.INVALID_USER;

    if (!user.data.response.email) {
      return {
        userId: userId,
        email: null,
      };
    }

    const naverUser: SocialUserInfo = {
      userId: userId,
      email: user.data.response.email,
    };

    return naverUser;
  } catch (error) {
    logger.e("NaverAuth error", error);
    return null;
  }
};

const kakaoAuth = async (kakaoAccessToken: string) => {
  try {
    const user = await axios({
      method: "get",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
      },
    });

    const userId = user.data.id;

    if (!userId) return execptionMessage.INVALID_USER;

    if (!user.data.kakao_account) {
      return {
        userId: userId,
        email: null,
      };
    }

    const kakaoUser: SocialUserInfo = {
      userId: userId,
      email: user.data.kakao_account.email,
    };

    return kakaoUser;
  } catch (error) {
    logger.e("KakaoAuth error", error);
    return null;
  }
};

const appleAuth = async (appleAccessToken: string) => {
  try {
    const user = jwt.decode(appleAccessToken);
    if (user === null) return null;
    if (!(user as jwt.JwtPayload).sub) return execptionMessage.INVALID_USER;

    if (!(user as jwt.JwtPayload).email) {
      return {
        userId: (user as jwt.JwtPayload).sub,
        email: null,
      };
    }

    const appleUser: SocialUserInfo = {
      userId: (user as jwt.JwtPayload).sub as string,
      email: (user as jwt.JwtPayload).email,
    };

    return appleUser;
  } catch (error) {
    logger.e("AppleAuth error", error);
    return null;
  }
};

export default {
  naverAuth,
  kakaoAuth,
  appleAuth,
};
