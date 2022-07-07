import { logger } from "./winstonConfig";
import axios from "axios";

const naverAuth = async (naverAccessToken: string): Promise<string | null> => {
  try {
    const user = await axios({
      method: "get",
      url: "https://openapi.naver.com/v1/nid/me",
      headers: {
        Authorization: `Bearer ${naverAccessToken}`,
      },
    });

    const naverUser = user.data.response.id;

    if (!naverUser) return null;

    return naverUser;
  } catch (error: any) {
    logger.log(error);
    return null;
  }
};

export default naverAuth;
