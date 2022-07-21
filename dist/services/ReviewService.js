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
const multer_1 = __importDefault(require("../config/multer"));
const winstonConfig_1 = require("../config/winstonConfig");
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
const Review_1 = __importDefault(require("../models/Review"));
const getReviewsByRestaurant = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield Review_1.default.find({
        restaurant: id,
    }).populate("writer");
    const reviewDto = reviews.map((review) => {
        return {
            id: review._id,
            writer: review.writer.name,
            score: review.score,
            content: review.content,
            image: review.image,
            taste: review.taste,
            good: review.good,
        };
    });
    return reviewDto;
});
const getReviewsByUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield Review_1.default.find({
        writer: id,
    }).populate("restaurant");
    const reviewDto = reviews.map((review) => {
        return {
            id: review._id,
            restaurant: review.restaurant.name,
            restaurantId: review.restaurant._id,
            score: review.score,
            content: review.content,
            image: review.image,
            taste: review.taste,
            good: review.good,
        };
    });
    return reviewDto;
});
const deleteReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = yield Restaurant_1.default.findOne({
        reviews: id,
    });
    if (!restaurant)
        return null;
    // 식당 리뷰 id 배열에서 삭제
    const reviewList = restaurant === null || restaurant === void 0 ? void 0 : restaurant.reviews;
    const updateList = reviewList.filter((review) => {
        review !== id;
    });
    yield Restaurant_1.default.findByIdAndUpdate(restaurant._id, {
        $set: { reviews: updateList },
    });
    // aws 버킷에서 이미지 파일 삭제
    const review = yield Review_1.default.findById(id);
    if (!review)
        return null;
    const promises = review.image.map((data) => __awaiter(void 0, void 0, void 0, function* () {
        yield multer_1.default.s3Delete(data.name);
    }));
    yield Promise.all(promises);
    // 데이터 삭제
    yield Review_1.default.deleteOne({ _id: id });
});
const getReviewsFromNaver = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const encodedName = encodeURI(name);
    const requestUrl = `https://openapi.naver.com/v1/search/blog?query=${encodedName}`;
    const result = yield axios_1.default.get(requestUrl, {
        headers: {
            "X-Naver-Client-Id": "SG2hLClLCFrOIl5uQh3y",
            "X-Naver-Client-Secret": "xwsh8rft0T",
        },
    });
    const blogReviews = {
        start: result.data.start,
        display: result.data.display,
        items: result.data.items,
    };
    return blogReviews;
});
const createReview = (reviewResponseDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let review;
        if (reviewResponseDto.good) {
            review = new Review_1.default({
                restaurant: reviewResponseDto.restaurantId,
                writer: reviewResponseDto.writerId,
                score: reviewResponseDto.score,
                content: reviewResponseDto.content,
                image: reviewResponseDto.image,
                taste: reviewResponseDto.taste,
                good: reviewResponseDto.good,
            });
        }
        else {
            review = new Review_1.default({
                restaurant: reviewResponseDto.restaurantId,
                writer: reviewResponseDto.writerId,
                score: reviewResponseDto.score,
                content: reviewResponseDto.content,
                image: reviewResponseDto.image,
                taste: reviewResponseDto.taste,
            });
        }
        const data = yield review.save();
        const restaurant = yield Restaurant_1.default.findById(reviewResponseDto.restaurantId);
        if (!restaurant)
            return null;
        const reviewList = restaurant.reviews;
        if (reviewList != undefined) {
            reviewList.push(data._id);
            yield Restaurant_1.default.findByIdAndUpdate(reviewResponseDto.restaurantId, {
                $set: { reviews: reviewList },
            });
        }
        else {
            yield Restaurant_1.default.findByIdAndUpdate(reviewResponseDto.restaurantId, {
                $set: { reviews: [data._id] },
            });
        }
        return data;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        throw error;
    }
});
const updateReview = (reviewResponseDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewId = reviewResponseDto.reviewId;
        const review = yield Review_1.default.findById(reviewId);
        if (review == undefined)
            return null;
        const imageFileList = review.image;
        const imageList = [];
        const promises = imageFileList.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            if (reviewResponseDto.nameList.includes(file.name)) {
                imageList.push(file);
            }
            else {
                yield multer_1.default.s3Delete(file.name);
            }
        }));
        yield Promise.all(promises);
        const promiseMerge = reviewResponseDto.image.map((image) => __awaiter(void 0, void 0, void 0, function* () {
            imageList.push(image);
        }));
        yield Promise.all(promiseMerge);
        yield Review_1.default.findByIdAndUpdate(reviewResponseDto.reviewId, {
            $set: {
                score: reviewResponseDto.score,
                taste: reviewResponseDto.taste,
                good: reviewResponseDto.good,
                content: reviewResponseDto.content,
                image: imageList,
            },
        });
        const result = yield Review_1.default.findById(reviewId);
        return result;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        throw error;
    }
});
exports.default = {
    getReviewsByRestaurant,
    createReview,
    getReviewsByUser,
    deleteReview,
    getReviewsFromNaver,
    updateReview,
};
//# sourceMappingURL=ReviewService.js.map