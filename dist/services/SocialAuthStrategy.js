"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authStrategy = void 0;
const auth_1 = __importDefault(require("../config/auth"));
class NaverAuthStrategy {
    execute(accessToken) {
        return auth_1.default.naverAuth(accessToken);
    }
}
class KakaoAuthStrategy {
    execute(accessToken) {
        return auth_1.default.kakaoAuth(accessToken);
    }
}
class AppleAuthStrategy {
    execute(accessToken) {
        return auth_1.default.appleAuth(accessToken);
    }
}
exports.authStrategy = {
    naver: new NaverAuthStrategy(),
    kakao: new KakaoAuthStrategy(),
    apple: new AppleAuthStrategy(),
};
//# sourceMappingURL=SocialAuthStrategy.js.map