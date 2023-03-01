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
const ReviewService_1 = __importDefault(require("../services/ReviewService"));
/**
 * @route GET /review/restaurant/:restaurantId
 * @desc 식당 리뷰 조회
 * @access Public
 */
const getReviewByRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantId = req.params.restaurantId;
    if (!restaurantId) {
        return res
            .status(statusCode_1.default.BAD_REQUEST)
            .send(BaseResponse_1.default.failure(statusCode_1.default.NOT_FOUND, responseMessage_1.default.NULL_VALUE));
    }
    try {
        const data = yield ReviewService_1.default.getReviewsByRestaurant(restaurantId);
        if (!data) {
            return res
                .status(statusCode_1.default.NOT_FOUND)
                .send(BaseResponse_1.default.failure(statusCode_1.default.NOT_FOUND, responseMessage_1.default.NOT_FOUND));
        }
        return res
            .status(statusCode_1.default.OK)
            .send(BaseResponse_1.default.success(statusCode_1.default.OK, responseMessage_1.default.READ_REVIEWS_BY_RESTAURANT, data));
    }
    catch (error) {
        winstonConfig_1.logger.e(`Review getReviewByRestaurant ${error}`);
        return res
            .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
            .send(BaseResponse_1.default.failure(statusCode_1.default.INTERNAL_SERVER_ERROR, responseMessage_1.default.INTERNAL_SERVER_ERROR));
    }
});
/**
 * @route GET /review/user/:userId
 * @desc 해당 유저가 쓴 리뷰 조회
 * @access Private
 */
const getReviewsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    if (!userId) {
        return res
            .status(statusCode_1.default.BAD_REQUEST)
            .send(BaseResponse_1.default.failure(statusCode_1.default.BAD_REQUEST, responseMessage_1.default.NULL_VALUE));
    }
    try {
        const data = yield ReviewService_1.default.getReviewsByUser(userId);
        if (!data) {
            return res
                .status(statusCode_1.default.NOT_FOUND)
                .send(BaseResponse_1.default.failure(statusCode_1.default.NOT_FOUND, responseMessage_1.default.NOT_FOUND));
        }
        return res
            .status(statusCode_1.default.OK)
            .send(BaseResponse_1.default.success(statusCode_1.default.OK, responseMessage_1.default.READ_REVIEWS_BY_USER, data));
    }
    catch (error) {
        winstonConfig_1.logger.e(`Review getReviewsByUser ${error}`);
        return res
            .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
            .send(BaseResponse_1.default.failure(statusCode_1.default.INTERNAL_SERVER_ERROR, responseMessage_1.default.INTERNAL_SERVER_ERROR));
    }
});
/**
 * @route DELETE /review/:reviewId
 * @desc 리뷰 삭제
 * @access Private
 */
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewId = req.params.reviewId;
    if (!reviewId) {
        return res
            .status(statusCode_1.default.BAD_REQUEST)
            .send(BaseResponse_1.default.failure(statusCode_1.default.BAD_REQUEST, responseMessage_1.default.NULL_VALUE));
    }
    try {
        const data = yield ReviewService_1.default.deleteReview(reviewId);
        if (!data) {
            return res
                .status(statusCode_1.default.NOT_FOUND)
                .send(BaseResponse_1.default.failure(statusCode_1.default.NOT_FOUND, responseMessage_1.default.NOT_FOUND));
        }
        return res
            .status(statusCode_1.default.OK)
            .send(BaseResponse_1.default.success(statusCode_1.default.OK, responseMessage_1.default.DELETE_REVIEW));
    }
    catch (error) {
        winstonConfig_1.logger.e(`Review deleteReview ${error}`);
        return res
            .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
            .send(BaseResponse_1.default.failure(statusCode_1.default.INTERNAL_SERVER_ERROR, responseMessage_1.default.INTERNAL_SERVER_ERROR));
    }
});
/**
 * @route GET /review/:restaurantId/blog
 * @desc 네이버블로그 리뷰 조회
 * @access Public
 */
const getReviewsFromNaver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantId = req.params.restaurantId;
    if (!restaurantId) {
        return res
            .status(statusCode_1.default.BAD_REQUEST)
            .send(BaseResponse_1.default.failure(statusCode_1.default.BAD_REQUEST, responseMessage_1.default.NULL_VALUE));
    }
    try {
        const data = yield ReviewService_1.default.getReviewsFromNaver(restaurantId);
        if (!data) {
            return res
                .status(statusCode_1.default.NOT_FOUND)
                .send(BaseResponse_1.default.failure(statusCode_1.default.NOT_FOUND, responseMessage_1.default.NOT_FOUND));
        }
        return res
            .status(statusCode_1.default.OK)
            .send(BaseResponse_1.default.success(statusCode_1.default.OK, responseMessage_1.default.READ_REVIEWS_FROM_NAVER, data));
    }
    catch (error) {
        winstonConfig_1.logger.e(`Review getReviewsFromNaver ${error}`);
        return res
            .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
            .send(BaseResponse_1.default.failure(statusCode_1.default.INTERNAL_SERVER_ERROR, responseMessage_1.default.INTERNAL_SERVER_ERROR));
    }
});
/**
 * @route POST /review/:userId/:restaurantId
 * @desc 리뷰 작성
 * @access Private
 */
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const score = req.body.score;
    const taste = req.body.taste;
    const content = req.body.content;
    const images = req.files;
    if (!score || !taste || !content) {
        return res
            .status(statusCode_1.default.BAD_REQUEST)
            .send(BaseResponse_1.default.failure(statusCode_1.default.BAD_REQUEST, responseMessage_1.default.NULL_VALUE));
    }
    try {
        const imageList = [];
        if (req.files) {
            const promises = images.map((image) => __awaiter(void 0, void 0, void 0, function* () {
                imageList.push({ name: image.originalname, url: image.location });
            }));
            yield Promise.all(promises);
        }
        const responseData = {
            restaurantId: req.params.restaurantId,
            writerId: req.params.userId,
            reviewId: "",
            score: req.body.score,
            taste: req.body.taste,
            good: req.body.good,
            content: req.body.content,
            image: imageList,
            nameList: [],
        };
        const data = yield ReviewService_1.default.createReview(responseData);
        if (!data) {
            return res
                .status(statusCode_1.default.NOT_FOUND)
                .send(BaseResponse_1.default.failure(statusCode_1.default.NOT_FOUND, responseMessage_1.default.NOT_FOUND));
        }
        return res
            .status(statusCode_1.default.OK)
            .send(BaseResponse_1.default.success(statusCode_1.default.OK, responseMessage_1.default.CREATE_REVIEW_SUCCESS, data));
    }
    catch (error) {
        winstonConfig_1.logger.e("ReviewController.createReview error", error);
        return res
            .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
            .send(BaseResponse_1.default.failure(statusCode_1.default.INTERNAL_SERVER_ERROR, responseMessage_1.default.INTERNAL_SERVER_ERROR));
    }
});
/**
 * @route PUT /review/:reviewId
 * @desc 리뷰 수정
 * @access Private
 */
const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewId = req.params.reviewId;
    const score = req.body.score;
    const taste = req.body.taste;
    const content = req.body.content;
    const images = req.files;
    if (!score || !taste || !content) {
        return res
            .status(statusCode_1.default.BAD_REQUEST)
            .send(BaseResponse_1.default.failure(statusCode_1.default.BAD_REQUEST, responseMessage_1.default.NULL_VALUE));
    }
    try {
        const imageList = [];
        if (req.files) {
            const promises = images.map((image) => __awaiter(void 0, void 0, void 0, function* () {
                imageList.push({ name: image.originalname, url: image.location });
            }));
            yield Promise.all(promises);
        }
        let nameList = [];
        if (req.body.nameList)
            nameList = req.body.nameList;
        const responseData = {
            restaurantId: "",
            writerId: "",
            reviewId: reviewId,
            score: req.body.score,
            taste: taste,
            good: req.body.good,
            content: req.body.content,
            image: imageList,
            nameList: nameList,
        };
        const data = yield ReviewService_1.default.updateReview(responseData);
        if (!data) {
            return res
                .status(statusCode_1.default.NOT_FOUND)
                .send(BaseResponse_1.default.failure(statusCode_1.default.NOT_FOUND, responseMessage_1.default.NOT_FOUND));
        }
        return res
            .status(statusCode_1.default.OK)
            .send(BaseResponse_1.default.success(statusCode_1.default.OK, responseMessage_1.default.UPDATE_REVIEW_SUCCESS, data));
    }
    catch (error) {
        winstonConfig_1.logger.e("ReviewController.updateReview error", error);
        return res
            .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
            .send(BaseResponse_1.default.failure(statusCode_1.default.INTERNAL_SERVER_ERROR, responseMessage_1.default.INTERNAL_SERVER_ERROR));
    }
});
exports.default = {
    getReviewByRestaurant,
    createReview,
    getReviewsByUser,
    deleteReview,
    getReviewsFromNaver,
    updateReview,
};
//# sourceMappingURL=ReviewController.js.map