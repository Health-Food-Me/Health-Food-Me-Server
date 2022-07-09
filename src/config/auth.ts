import axios from "axios";
import em from "../modules/exceptionMessage";
import jwt from "jsonwebtoken";

const naverAuth = async (naverAccessToken: string) => {
  try {
    const user = await axios({
      method: "get",
      url: "https://openapi.naver.com/v1/nid/me",
      headers: {
        Authorization: `Bearer ${naverAccessToken}`,
      },
    });

    const naverUser = user.data.response.email;

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

    const kakaoUser = user.data.kakao_account.email;

    if (!kakaoUser) return em.INVALID_USER;

    return kakaoUser;
  } catch (error) {
    return null;
  }
};

const appleAuth = async (appleAccessToken: string) => {
  try {
    const appleUser = jwt.decode(appleAccessToken);
    if (appleUser === null) return null;
    if ((appleUser as jwt.JwtPayload).email_verified === "false") return null;

    return (appleUser as jwt.JwtPayload).email;
  } catch (error) {
    return null;
  }
};

export default {
  naverAuth,
  kakaoAuth,
  appleAuth,
};
