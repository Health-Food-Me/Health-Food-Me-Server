import { logger } from "../config/winstonConfig";
import naverAuth from "../config/auth";

const getUser = async (social: string, accessToken: string) => {
  try {
    let user;
    switch (social) {
      case "naver":
        user = await naverAuth(accessToken);
        break;
    }
    return user;
  } catch (error: any) {
    logger.log(error);
    throw error;
  }
};

export default {
  getUser,
};
