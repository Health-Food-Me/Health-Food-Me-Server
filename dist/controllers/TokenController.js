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
const jwtHandler_1 = __importDefault(require("../modules/jwtHandler"));
const responseMessage_1 = __importDefault(require("../modules/responseMessage"));
const statusCode_1 = __importDefault(require("../modules/statusCode"));
const UserService_1 = __importDefault(require("../services/UserService"));
/**
 * @route GET /auth/token
 * @desc Get new access token by refresh token
 * @access private
 */
const getToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.headers.accesstoken;
    const refreshToken = req.headers.refreshtoken;
    if (!accessToken || !refreshToken) {
        return res
            .status(statusCode_1.default.BAD_REQUEST)
            .send(BaseResponse_1.default.failure(statusCode_1.default.BAD_REQUEST, responseMessage_1.default.NULL_VALUE_TOKEN));
    }
    try {
        const access = jwtHandler_1.default.verify(accessToken);
        if (access === exceptionMessage_1.default.TOKEN_INVALID) {
            return res
                .status(statusCode_1.default.UNAUTHORIZED)
                .send(BaseResponse_1.default.failure(statusCode_1.default.UNAUTHORIZED, responseMessage_1.default.INVALID_TOKEN));
        }
        if (access === exceptionMessage_1.default.TOKEN_EXPIRED) {
            const refresh = jwtHandler_1.default.verify(refreshToken);
            if (refresh === exceptionMessage_1.default.TOKEN_INVALID) {
                return res
                    .status(statusCode_1.default.UNAUTHORIZED)
                    .send(BaseResponse_1.default.failure(statusCode_1.default.UNAUTHORIZED, responseMessage_1.default.INVALID_TOKEN));
            }
            if (refresh === exceptionMessage_1.default.TOKEN_EXPIRED) {
                return res
                    .status(statusCode_1.default.UNAUTHORIZED)
                    .send(BaseResponse_1.default.failure(statusCode_1.default.UNAUTHORIZED, responseMessage_1.default.EXPIRED_TOKEN));
            }
            const user = yield UserService_1.default.findUserByRfToken(refreshToken);
            if (!user) {
                return res
                    .status(statusCode_1.default.UNAUTHORIZED)
                    .send(BaseResponse_1.default.failure(statusCode_1.default.UNAUTHORIZED, responseMessage_1.default.INVALID_TOKEN));
            }
            const data = {
                accessToken: jwtHandler_1.default.sign(user === null || user === void 0 ? void 0 : user._id, user === null || user === void 0 ? void 0 : user.email),
                refreshToken: refreshToken,
            };
            return res
                .status(statusCode_1.default.OK)
                .send(BaseResponse_1.default.success(statusCode_1.default.OK, responseMessage_1.default.CREATE_TOKEN_SUCCESS, data));
        }
        return res
            .status(statusCode_1.default.BAD_REQUEST)
            .send(BaseResponse_1.default.failure(statusCode_1.default.BAD_REQUEST, responseMessage_1.default.VALID_TOKEN));
    }
    catch (error) {
        winstonConfig_1.logger.e("TokenController getToken error: ", error);
        return res
            .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
            .send(BaseResponse_1.default.failure(statusCode_1.default.INTERNAL_SERVER_ERROR, responseMessage_1.default.INTERNAL_SERVER_ERROR));
    }
});
exports.default = { getToken };
//# sourceMappingURL=TokenController.js.map