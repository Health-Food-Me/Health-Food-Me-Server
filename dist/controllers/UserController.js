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
const exceptionMessage_1 = __importDefault(require("../modules/exceptionMessage"));
const jwtHandler_1 = __importDefault(require("../modules/jwtHandler"));
const responseMessage_1 = __importDefault(require("../modules/responseMessage"));
const statusCode_1 = __importDefault(require("../modules/statusCode"));
const BaseResponse_1 = __importDefault(require("../modules/BaseResponse"));
const services_1 = __importDefault(require("../services"));
const winstonConfig_1 = require("../config/winstonConfig");
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
        const user = yield services_1.default.getUser(social, token);
        if (!user) {
            return res
                .status(statusCode_1.default.UNAUTHORIZED)
                .send(BaseResponse_1.default.failure(statusCode_1.default.UNAUTHORIZED, responseMessage_1.default.INVALID_TOKEN));
        }
        if (user === exceptionMessage_1.default.INVALID_USER) {
            return res
                .status(statusCode_1.default.UNAUTHORIZED)
                .send(BaseResponse_1.default.failure(statusCode_1.default.UNAUTHORIZED, responseMessage_1.default.UNAUTHORIZED_SOCIAL_USER));
        }
        const existUser = yield services_1.default.findUserById(user.userId, social);
        if (!existUser) {
            const data = createUser(social, user);
            return res
                .status(statusCode_1.default.OK)
                .send(BaseResponse_1.default.success(statusCode_1.default.OK, responseMessage_1.default.SIGN_UP_SUCCESS, data));
        }
        const refreshToken = jwtHandler_1.default.createRefresh();
        const accessToken = jwtHandler_1.default.sign(existUser._id, existUser.email);
        yield services_1.default.updateRefreshToken(existUser._id, refreshToken);
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
        const newUser = yield services_1.default.signUpUser(social, user.userId, user.email, refreshToken);
        const accessToken = jwtHandler_1.default.sign(newUser._id, newUser.email);
        return {
            user: newUser,
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    });
}
exports.default = {
    getUser,
};
//# sourceMappingURL=UserController.js.map