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
const BaseResponse_1 = __importDefault(require("../modules/BaseResponse"));
const exceptionMessage_1 = __importDefault(require("../modules/exceptionMessage"));
const exceptionMessage_2 = __importDefault(require("../modules/exceptionMessage"));
const jwtHandler_1 = __importDefault(require("../modules/jwtHandler"));
const responseMessage_1 = __importDefault(require("../modules/responseMessage"));
const statusCode_1 = __importDefault(require("../modules/statusCode"));
const UserService_1 = __importDefault(require("../services/UserService"));
/**
 * @route POST /auth
 * @desc Authenticate user & Get token
 * @access Private
 */
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const social = req.body.social;
    const token = req.body.token;
    if (!social || !token) {
        return res
            .status(statusCode_1.default.UNAUTHORIZED)
            .send(BaseResponse_1.default.failure(statusCode_1.default.UNAUTHORIZED, responseMessage_1.default.NULL_VALUE_TOKEN));
    }
    try {
        const user = yield UserService_1.default.getUser(social, token);
        if (!user) {
            return res
                .status(statusCode_1.default.UNAUTHORIZED)
                .send(BaseResponse_1.default.failure(statusCode_1.default.UNAUTHORIZED, responseMessage_1.default.INVALID_TOKEN));
        }
        if (user === exceptionMessage_2.default.INVALID_USER) {
            return res
                .status(statusCode_1.default.UNAUTHORIZED)
                .send(BaseResponse_1.default.failure(statusCode_1.default.UNAUTHORIZED, responseMessage_1.default.UNAUTHORIZED_SOCIAL_USER));
        }
        const existUser = yield UserService_1.default.findUserById(user.userId, social);
        if (!existUser) {
            const data = createUser(social, user);
            return res
                .status(statusCode_1.default.OK)
                .send(BaseResponse_1.default.success(statusCode_1.default.OK, responseMessage_1.default.SIGN_UP_SUCCESS, yield data));
        }
        const refreshToken = jwtHandler_1.default.createRefresh();
        const accessToken = jwtHandler_1.default.sign(existUser._id, existUser.email);
        yield UserService_1.default.updateRefreshToken(existUser._id, refreshToken);
        const data = {
            user: existUser,
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
        return res
            .status(statusCode_1.default.OK)
            .send(BaseResponse_1.default.success(statusCode_1.default.OK, responseMessage_1.default.SIGN_IN_SUCCESS, data));
    }
    catch (error) {
        winstonConfig_1.logger.e("UserController getUser error", error);
        return res
            .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
            .send(BaseResponse_1.default.failure(statusCode_1.default.INTERNAL_SERVER_ERROR, responseMessage_1.default.INTERNAL_SERVER_ERROR));
    }
});
function createUser(social, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const refreshToken = jwtHandler_1.default.createRefresh();
        const newUser = yield UserService_1.default.signUpUser(social, user.userId, user.email, refreshToken);
        const accessToken = jwtHandler_1.default.sign(newUser._id, newUser.email);
        return {
            user: newUser,
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    });
}
/**
 * @route PUT /user/:userId/scrap/:restaurantId
 * @desc User's scraping the restaurant
 * @access Private
 */
const scrapRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const restaurantId = req.params.restaurantId;
    try {
        const isScrap = yield UserService_1.default.scrapRestaurant(userId, restaurantId);
        if (!isScrap) {
            return res
                .status(statusCode_1.default.NOT_FOUND)
                .send(BaseResponse_1.default.failure(statusCode_1.default.NOT_FOUND, responseMessage_1.default.NOT_FOUND));
        }
        const data = { isScrap: isScrap };
        return res
            .status(statusCode_1.default.OK)
            .send(BaseResponse_1.default.success(statusCode_1.default.OK, responseMessage_1.default.UPDATE_SCRAP_SUCCESS, data));
    }
    catch (error) {
        winstonConfig_1.logger.e("UserController.scrapRestaurant error", error);
        return res
            .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
            .send(BaseResponse_1.default.failure(statusCode_1.default.INTERNAL_SERVER_ERROR, responseMessage_1.default.INTERNAL_SERVER_ERROR));
    }
});
/**
 * @route GET /user/:userId/scraps
 * @desc 유저 스크랩 모아보기
 * @access Private
 */
const getUserScrpaList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const scrapList = yield UserService_1.default.getUserScrpaList(userId);
        if (!scrapList) {
            return res
                .status(statusCode_1.default.NOT_FOUND)
                .send(BaseResponse_1.default.failure(statusCode_1.default.NOT_FOUND, responseMessage_1.default.NOT_FOUND));
        }
        return res
            .status(statusCode_1.default.OK)
            .send(BaseResponse_1.default.success(statusCode_1.default.OK, responseMessage_1.default.READ_SCRAP_LIST_SUCCESS, scrapList));
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        return res
            .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
            .send(BaseResponse_1.default.failure(statusCode_1.default.INTERNAL_SERVER_ERROR, responseMessage_1.default.INTERNAL_SERVER_ERROR));
    }
});
/**
 * @route GET /user/:userId/profile
 * @desc Get User Profile
 * @access Private
 */
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const userProfile = yield UserService_1.default.getUserProfile(userId);
        if (!userProfile) {
            return res
                .status(statusCode_1.default.NOT_FOUND)
                .send(BaseResponse_1.default.failure(statusCode_1.default.NOT_FOUND, responseMessage_1.default.NOT_FOUND));
        }
        return res
            .status(statusCode_1.default.OK)
            .send(BaseResponse_1.default.success(statusCode_1.default.OK, responseMessage_1.default.READ_USER_PROFILE_SUCCESS, userProfile));
    }
    catch (error) {
        winstonConfig_1.logger.e("UserController.getUserProfile error", error);
        return res
            .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
            .send(BaseResponse_1.default.failure(statusCode_1.default.INTERNAL_SERVER_ERROR, responseMessage_1.default.INTERNAL_SERVER_ERROR));
    }
});
/**
 * @route PUT /user/:userId/profile
 * @desc Update User Profile
 * @access Private
 */
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const userName = req.body.name;
    if (!userId || !userName) {
        return res
            .status(statusCode_1.default.BAD_REQUEST)
            .send(BaseResponse_1.default.failure(statusCode_1.default.BAD_REQUEST, responseMessage_1.default.NULL_VALUE));
    }
    try {
        const user = yield UserService_1.default.updateUserProfile(userId, userName);
        if (!user) {
            return res
                .status(statusCode_1.default.NOT_FOUND)
                .send(BaseResponse_1.default.failure(statusCode_1.default.NOT_FOUND, responseMessage_1.default.NOT_FOUND));
        }
        if (user === exceptionMessage_1.default.DUPLICATE_NAME) {
            return res
                .status(statusCode_1.default.FORBIDDEN)
                .send(BaseResponse_1.default.failure(statusCode_1.default.FORBIDDEN, responseMessage_1.default.DUPLICATE_USER_NAME));
        }
        return res
            .status(statusCode_1.default.OK)
            .send(BaseResponse_1.default.success(statusCode_1.default.OK, responseMessage_1.default.UPDATE_USER_PROFILE_SUCCESS, user));
    }
    catch (error) {
        winstonConfig_1.logger.e("UserController.updateUserProfile error", error);
        return res
            .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
            .send(BaseResponse_1.default.failure(statusCode_1.default.INTERNAL_SERVER_ERROR, responseMessage_1.default.INTERNAL_SERVER_ERROR));
    }
});
/**
 * @route DELETE /auth/withdrawal/:userId
 * @desc User Withdrawal
 * @access Private
 */
const withdrawUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const result = yield UserService_1.default.withdrawUser(userId);
        if (!result) {
            return res
                .status(statusCode_1.default.NOT_FOUND)
                .send(BaseResponse_1.default.failure(statusCode_1.default.NOT_FOUND, responseMessage_1.default.NOT_FOUND));
        }
        return res
            .status(statusCode_1.default.OK)
            .send(BaseResponse_1.default.success(statusCode_1.default.OK, responseMessage_1.default.DELETE_USER_SUCCESS));
    }
    catch (error) {
        winstonConfig_1.logger.e("UserController.destroyUser error", error);
        return res
            .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
            .send(BaseResponse_1.default.failure(statusCode_1.default.INTERNAL_SERVER_ERROR, responseMessage_1.default.INTERNAL_SERVER_ERROR));
    }
});
exports.default = {
    getUser,
    scrapRestaurant,
    getUserScrpaList,
    getUserProfile,
    updateUserProfile,
    withdrawUser,
};
//# sourceMappingURL=UserController.js.map