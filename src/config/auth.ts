import axios from "axios";
import em from "../modules/exceptionMessage";

const naverAuth = async (naverAccessToken: string) => {
  try {
    const user = await axios({
      method: "get",
      url: "https://openapi.naver.com/v1/nid/me",
      headers: {
        Authorization: `Bearer ${naverAccessToken}`,
      },
    });

    const naverUser = user.data.response.id;

    if (!naverUser) return em.INVALID_USER;

    return naverUser;
  } catch (error) {
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

    const kakaoUser = user.data.id;

    if (!kakaoUser) return em.INVALID_USER;

    return kakaoUser;
  } catch (error) {
    return null;
  }
};

export default {
  naverAuth,
  kakaoAuth,
};
