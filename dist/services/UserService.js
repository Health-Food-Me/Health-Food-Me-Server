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
const winstonConfig_1 = require("../config/winstonConfig");
const User_1 = __importDefault(require("../models/User"));
const SocialAuthStrategy_1 = require("./SocialAuthStrategy");
const getUser = (social, accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield SocialAuthStrategy_1.authStrategy[social].execute(accessToken);
        return user;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        throw error;
    }
});
const findUserById = (userId, social) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({
            social: social,
            socialId: userId,
        });
        return user;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        throw error;
    }
});
const signUpUser = (social, socialId, email, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCount = yield User_1.default.count();
        const user = new User_1.default({
            name: `헬푸미${userCount + 1}`,
            social: social,
            socialId: socialId,
            email: email,
            scrapRestaurants: [],
            refreshToken: refreshToken,
        });
        yield user.save();
        return user;
    }
    catch (error) {
        winstonConfig_1.logger.e("", error);
        throw error;
    }
});
const updateRefreshToken = (userId, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User_1.default.updateOne({ _id: userId }, { $set: { refreshToken: refreshToken } });
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        throw error;
    }
});
const findUserByRfToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({
            refreshToken: refreshToken,
        });
        return user;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        throw error;
    }
});
exports.default = {
    getUser,
    findUserById,
    signUpUser,
    updateRefreshToken,
    findUserByRfToken,
};
//# sourceMappingURL=UserService.js.map