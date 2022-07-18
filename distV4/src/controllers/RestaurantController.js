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
const responseMessage_1 = __importDefault(require("../modules/responseMessage"));
const statusCode_1 = __importDefault(require("../modules/statusCode"));
const RestaurantService_1 = __importDefault(require("../services/RestaurantService"));
/**
 * @route GET /restaurant/:restaurantId/:userId
 * @desc 식당 카드의 요약 정보를 호출
 * @access Private
 */
const getRestaurantSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantId, userId } = req.params;
    try {
        const restaurant = yield RestaurantService_1.default.getRestaurantSummary(restaurantId, userId);
        if (!restaurant) {
            return res
                .status(statusCode_1.default.NOT_FOUND)
                .send(BaseResponse_1.default.failure(statusCode_1.default.NOT_FOUND, responseMessage_1.default.NOT_FOUND));
        }
        return res
            .status(statusCode_1.default.OK)
            .send(BaseResponse_1.default.success(statusCode_1.default.OK, responseMessage_1.default.READ_RESTAURANT_SUMMARY_SUCCESS, restaurant));
    }
    catch (error) {
        winstonConfig_1.logger.e("RestaurantController.getRestaurantSummary error", error);
        return res
            .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
            .send(BaseResponse_1.default.failure(statusCode_1.default.INTERNAL_SERVER_ERROR, responseMessage_1.default.INTERNAL_SERVER_ERROR));
    }
});
/**
 * @route GET /restaurant/:restaurantId/menus
 * @desc Restaurant's menu detail
 * @access Private
 */
const getMenuDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantId = req.params.restaurantId;
    const latitude = req.query.latitude;
    const longtitude = req.query.longtitude;
    if (!latitude || !longtitude) {
        return res
            .status(statusCode_1.default.BAD_REQUEST)
            .send(BaseResponse_1.default.failure(statusCode_1.default.BAD_REQUEST, responseMessage_1.default.NULL_VALUE));
    }
    try {
        const data = yield RestaurantService_1.default.getMenuDetail(restaurantId, Number(latitude), Number(longtitude));
        if (!data) {
            return res
                .status(statusCode_1.default.NOT_FOUND)
                .send(BaseResponse_1.default.failure(statusCode_1.default.NOT_FOUND, responseMessage_1.default.NOT_FOUND));
        }
        return res
            .status(statusCode_1.default.OK)
            .send(BaseResponse_1.default.success(statusCode_1.default.OK, responseMessage_1.default.READ_RESTAURANT_MENU_SUCCESS, data));
    }
    catch (error) {
        winstonConfig_1.logger.e("RestaurantController.getMenuDetail error", error);
        return res
            .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
            .send(BaseResponse_1.default.failure(statusCode_1.default.INTERNAL_SERVER_ERROR, responseMessage_1.default.INTERNAL_SERVER_ERROR));
    }
});
/**
 * @route GET /restaurant?longitude=number&latitude=number&zoom=number
 * @desc 식당 카드의 요약 정보를 호출
 * @access Private
 */
const getAroundRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const longitude = req.query.longitude;
    const latitude = req.query.latitude;
    const zoom = req.query.zoom;
    if (!longitude && !latitude && !zoom) {
        res
            .status(statusCode_1.default.BAD_REQUEST)
            .send(BaseResponse_1.default.failure(statusCode_1.default.BAD_REQUEST, responseMessage_1.default.NULL_VALUE_PARAM));
    }
    try {
        const restaurants = yield RestaurantService_1.default.getAroundRestaurants(Number(longitude), Number(latitude), Number(zoom));
        if (!restaurants) {
            return res
                .status(statusCode_1.default.NO_CONTENT)
                .send(BaseResponse_1.default.success(statusCode_1.default.NO_CONTENT, responseMessage_1.default.READ_AROUND_RESTAURANT_SUCCESS));
        }
        return res
            .status(statusCode_1.default.OK)
            .send(BaseResponse_1.default.success(statusCode_1.default.OK, responseMessage_1.default.READ_AROUND_RESTAURANT_SUCCESS, restaurants));
    }
    catch (error) {
        winstonConfig_1.logger.e("RestaurantController.getAroundRestaurants error", error);
        return res
            .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
            .send(BaseResponse_1.default.failure(statusCode_1.default.INTERNAL_SERVER_ERROR, responseMessage_1.default.INTERNAL_SERVER_ERROR));
    }
});
/**
 * @route GET /restaurant/:restaurantId/prescription
 * @desc 외식 대처법 정보 조회
 * @access Private
 */
const getPrescription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantId = req.params.restaurantId;
    try {
        const prescription = yield RestaurantService_1.default.getPrescription(restaurantId);
        if (!prescription) {
            return res
                .status(statusCode_1.default.NOT_FOUND)
                .send(BaseResponse_1.default.failure(statusCode_1.default.NOT_FOUND, responseMessage_1.default.NOT_FOUND));
        }
        return res
            .status(statusCode_1.default.OK)
            .send(BaseResponse_1.default.success(statusCode_1.default.OK, responseMessage_1.default.READ_PRESCRIPTION_SUCCESS, prescription));
    }
    catch (error) {
        winstonConfig_1.logger.e("RestaurantController.getPrescription error", error);
        return res
            .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
            .send(BaseResponse_1.default.failure(statusCode_1.default.INTERNAL_SERVER_ERROR, responseMessage_1.default.INTERNAL_SERVER_ERROR));
    }
});
/**
 * @route GET /restaurant/search/card?longtitude=<경도>&latitude=<위도>&zoom=<반경범위>&keyword=<검색어>
 * @desc 식당 후 검색어가 포함된 명칭의 주변 식당 정보 카드 리스트 조회
 * @access Private
 */
const searchRestaurantCardList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const longtitude = req.query.longtitude;
    const latitude = req.query.latitude;
    const zoom = req.query.zoom;
    const keyword = req.query.keyword;
    if (!longtitude || !latitude || !zoom || !keyword) {
        return res
            .status(statusCode_1.default.BAD_REQUEST)
            .send(BaseResponse_1.default.failure(statusCode_1.default.BAD_REQUEST, responseMessage_1.default.NULL_VALUE));
    }
    try {
        const data = yield RestaurantService_1.default.getRestaurantCardList(Number(longtitude), Number(latitude), Number(zoom), keyword);
        return res
            .status(statusCode_1.default.OK)
            .send(BaseResponse_1.default.success(statusCode_1.default.OK, responseMessage_1.default.SEARCH_RESTAURANT_CARD_SUCCESS, data));
    }
    catch (error) {
        winstonConfig_1.logger.e("RestaurantController.searchRestaurantCardList error", error);
        return res
            .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
            .send(BaseResponse_1.default.failure(statusCode_1.default.INTERNAL_SERVER_ERROR, responseMessage_1.default.INTERNAL_SERVER_ERROR));
    }
});
/**
 * @route GET /restaurant/search/auto?query=<검색어>
 * @desc 식당 후 검색어가 포함된 명칭의 주변 식당 정보 카드 리스트 조회
 * @access Private
 */
const getSearchAutoCompleteResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.query;
    if (!query) {
        return res
            .status(statusCode_1.default.BAD_REQUEST)
            .send(BaseResponse_1.default.failure(statusCode_1.default.BAD_REQUEST, responseMessage_1.default.NULL_VALUE));
    }
    try {
        const data = yield RestaurantService_1.default.getSearchAutoCompleteResult(query);
        return res
            .status(statusCode_1.default.OK)
            .send(BaseResponse_1.default.success(statusCode_1.default.OK, responseMessage_1.default.AUTO_KEYWORD_SEARCH_RESTAURANT_SUCCESS, data));
    }
    catch (error) {
        winstonConfig_1.logger.e("RestaurantController.getSearchAutoCompleteResult error", error);
        return res
            .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
            .send(BaseResponse_1.default.failure(statusCode_1.default.INTERNAL_SERVER_ERROR, responseMessage_1.default.INTERNAL_SERVER_ERROR));
    }
});
exports.default = {
    getRestaurantSummary,
    getMenuDetail,
    getAroundRestaurants,
    getPrescription,
    searchRestaurantCardList,
    getSearchAutoCompleteResult,
};
//# sourceMappingURL=RestaurantController.js.map