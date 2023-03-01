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
const User_1 = __importDefault(require("../models/User"));
const config_1 = __importDefault(require("../config"));
const getReviewsByRestaurant = (restaurantId) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = yield Restaurant_1.default.findById(restaurantId);
    if (!restaurant)
        return null;
    const reviews = yield Review_1.default.find({ restaurant: restaurantId }).sort({
        createdAt: -1,
    });
    const reviewList = [];
    for (let i = 0; i < reviews.length; i++) {
        const user = yield User_1.default.findById(reviews[i].writer);
        if (!user) {
            const result = yield deleteReview(reviews[i]._id);
            if (!result) {
                yield Review_1.default.findByIdAndDelete(reviews[i]._id);
            }
            continue;
        }
        let images = reviews[i].image;
        if (!images)
            images = [];
        let goods = reviews[i].good;
        if (!goods)
            goods = [];
        const data = {
            _id: reviews[i]._id,
            writer: user.name,
            score: reviews[i].score,
            content: reviews[i].content,
            image: images,
            taste: reviews[i].taste,
            good: goods,
        };
        reviewList.push(data);
    }
    return reviewList;
});
const getReviewsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(userId);
    if (!user)
        return null;
    const reviews = yield Review_1.default.find({ writer: userId }).sort({
        createdAt: -1,
    });
    const reviewList = [];
    for (let i = 0; i < reviews.length; i++) {
        const restaurant = yield Restaurant_1.default.findById(reviews[i].restaurant);
        if (!restaurant) {
            const result = yield deleteReview(reviews[i]._id);
            if (!result) {
                yield Review_1.default.findByIdAndDelete(reviews[i]._id);
            }
            continue;
        }
        let images = reviews[i].image;
        if (!images)
            images = [];
        let goods = reviews[i].good;
        if (!goods)
            goods = [];
        const data = {
            _id: reviews[i]._id,
            restaurantId: restaurant._id,
            restaurant: restaurant.name,
            score: reviews[i].score,
            content: reviews[i].content,
            image: images,
            taste: reviews[i].taste,
            good: goods,
        };
        reviewList.push(data);
    }
    return reviewList;
});
const deleteReview = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield Review_1.default.findById(reviewId)
        .populate("writer")
        .populate("restaurant");
    if (!review)
        return null;
    if (review.restaurant) {
        const restaurantReviewList = review.restaurant.review;
        const restaurantReviewResult = restaurantReviewList.filter((review) => review.toString() !== reviewId);
        yield Restaurant_1.default.findByIdAndUpdate(review.restaurant._id, {
            $set: { review: restaurantReviewResult },
        });
    }
    if (review.writer) {
        const userReviewList = review.writer.reviews;
        const userReviewResult = userReviewList.filter((review) => review.toString() !== reviewId);
        yield User_1.default.findByIdAndUpdate(review.writer._id, {
            $set: { reviews: userReviewResult },
        });
    }
    const promises = review.image.map((data) => __awaiter(void 0, void 0, void 0, function* () {
        yield multer_1.default.s3Delete(data.name);
    }));
    yield Promise.all(promises);
    yield Review_1.default.findByIdAndDelete(reviewId);
    return true;
});
const getReviewsFromNaver = (restaurantId) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = yield Restaurant_1.default.findById(restaurantId);
    if (!restaurant)
        return null;
    const name = restaurant.name;
    const encodedName = encodeURI(name);
    const requestUrl = `https://openapi.naver.com/v1/search/blog?query=${encodedName}`;
    const result = yield axios_1.default.get(requestUrl, {
        headers: {
            "X-Naver-Client-Id": config_1.default.naverClientId,
            "X-Naver-Client-Secret": config_1.default.naverClientSecret,
        },
    });
    const blogReviews = {
        start: result.data.start,
        display: result.data.display,
        items: result.data.items,
    };
    return blogReviews;
});
const createReview = (reviewResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurantId = reviewResponse.restaurantId;
        const restaurant = yield Restaurant_1.default.findById(restaurantId);
        const userId = reviewResponse.writerId;
        const user = yield User_1.default.findById(userId);
        if (!restaurant || !user)
            return null;
        let good = reviewResponse.good;
        if (!good)
            good = [];
        const review = new Review_1.default({
            restaurant: restaurantId,
            writer: userId,
            score: reviewResponse.score,
            content: reviewResponse.content,
            image: reviewResponse.image,
            taste: reviewResponse.taste,
            good: good,
        });
        const result = yield review.save();
        let restaurantReviewList = restaurant.review;
        if (!restaurantReviewList)
            restaurantReviewList = [];
        restaurantReviewList.push(result._id);
        yield Restaurant_1.default.findByIdAndUpdate(restaurantId, {
            $set: { review: restaurantReviewList },
        });
        let userReviewList = user.reviews;
        if (!userReviewList)
            userReviewList = [];
        userReviewList.push(result._id);
        yield User_1.default.findByIdAndUpdate(userId, {
            $set: { reviews: userReviewList },
        });
        const data = {
            _id: result._id,
            restaurantId: restaurantId,
            restaurant: restaurant.name,
            writerId: userId,
            writer: user.name,
            score: result.score,
            content: result.content,
            image: result.image,
            taste: result.taste,
            good: result.good,
        };
        return data;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        throw error;
    }
});
const updateReview = (reviewResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewId = reviewResponse.reviewId;
        const review = yield Review_1.default.findById(reviewId);
        if (!review)
            return null;
        const imageFileList = review.image;
        const imageList = [];
        const promises = imageFileList.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            if (reviewResponse.nameList.includes(file.name)) {
                imageList.push(file);
            }
            else {
                yield multer_1.default.s3Delete(file.name);
            }
        }));
        yield Promise.all(promises);
        const promiseMerge = reviewResponse.image.map((image) => __awaiter(void 0, void 0, void 0, function* () {
            imageList.push(image);
        }));
        yield Promise.all(promiseMerge);
        const result = yield Review_1.default.findByIdAndUpdate(reviewResponse.reviewId, {
            $set: {
                score: reviewResponse.score,
                taste: reviewResponse.taste,
                good: reviewResponse.good,
                content: reviewResponse.content,
                image: imageList,
            },
        }, { new: true });
        if (!result)
            return null;
        const restaurantId = result.restaurant;
        const restaurant = yield Restaurant_1.default.findById(restaurantId);
        const userId = result.writer;
        const user = yield User_1.default.findById(userId);
        if (!restaurant || !user) {
            yield deleteReview(result._id);
            return null;
        }
        const data = {
            _id: result._id,
            restaurantId: restaurantId,
            restaurant: restaurant.name,
            writerId: userId,
            writer: user.name,
            score: result.score,
            content: result.content,
            image: result.image,
            taste: result.taste,
            good: result.good,
        };
        return data;
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