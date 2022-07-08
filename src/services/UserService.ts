import { logger } from "../config/winstonConfig";
import auth from "../config/auth";

const getUser = async (social: string, accessToken: string) => {
  try {
    let user;
    switch (social) {
      case "naver":
        user = await auth.naverAuth(accessToken);
        break;
      case "kakao":
        user = await auth.kakaoAuth(accessToken);
        break;
    }
    return user;
  } catch (error) {
    logger.error("", error);
    throw error;
  }
};

export default {
  getUser,
};
