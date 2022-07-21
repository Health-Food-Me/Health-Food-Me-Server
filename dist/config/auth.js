"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const exceptionMessage_1 = __importDefault(require("../modules/exceptionMessage"));
const winstonConfig_1 = require("./winstonConfig");
const naverAuth = (naverAccessToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, axios_1.default)({
            method: "get",
            url: "https://openapi.naver.com/v1/nid/me",
            headers: {
                Authorization: `Bearer ${naverAccessToken}`,
            },
        });
        const userId = user.data.response.id;
        if (!userId)
            return exceptionMessage_1.default.INVALID_USER;
        if (!user.data.response.email) {
            return {
                userId: userId,
                email: null,
            };
        }
        const naverUser = {
            userId: userId,
            email: user.data.response.email,
        };
        return naverUser;
    }
    catch (error) {
        winstonConfig_1.logger.e("NaverAuth error", error);
        return null;
    }
});
const kakaoAuth = (kakaoAccessToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, axios_1.default)({
            method: "get",
            url: "https://kapi.kakao.com/v2/user/me",
            headers: {
                Authorization: `Bearer ${kakaoAccessToken}`,
            },
        });
        const userId = user.data.id;
        if (!userId)
            return exceptionMessage_1.default.INVALID_USER;
        if (!user.data.kakao_account) {
            return {
                userId: userId,
                email: null,
            };
        }
        const kakaoUser = {
            userId: userId,
            email: user.data.kakao_account.email,
        };
        return kakaoUser;
    }
    catch (error) {
        winstonConfig_1.logger.e("KakaoAuth error", error);
        return null;
    }
});
const appleAuth = (appleAccessToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = jsonwebtoken_1.default.decode(appleAccessToken);
        if (user === null)
            return null;
        if (!user.sub)
            return exceptionMessage_1.default.INVALID_USER;
        if (!user.email) {
            return {
                userId: user.sub,
                email: null,
            };
        }
        const appleUser = {
            userId: user.sub,
            email: user.email,
        };
        return appleUser;
    }
    catch (error) {
        winstonConfig_1.logger.e("AppleAuth error", error);
        return null;
    }
});
exports.default = {
    naverAuth,
    kakaoAuth,
    appleAuth,
};
//# sourceMappingURL=auth.js.map