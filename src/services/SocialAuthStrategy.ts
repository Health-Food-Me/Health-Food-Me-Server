import auth from "../config/auth";
import { SocialPlatform } from "./UserService";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface SocialAuthStrategy {
  execute(accessToken: string): Promise<any>;
}

class NaverAuthStrategy implements SocialAuthStrategy {
  execute(accessToken: string): Promise<any> {
    return auth.naverAuth(accessToken);
  }
}

class KakaoAuthStrategy implements SocialAuthStrategy {
  execute(accessToken: string): Promise<any> {
    return auth.kakaoAuth(accessToken);
  }
}

class AppleAuthStrategy implements SocialAuthStrategy {
  execute(accessToken: string): Promise<any> {
    return auth.appleAuth(accessToken);
  }
}

type AuthType = {
  [social in SocialPlatform]: SocialAuthStrategy;
};

export const authStrategy: AuthType = {
  naver: new NaverAuthStrategy(),
  kakao: new KakaoAuthStrategy(),
  apple: new AppleAuthStrategy(),
};
