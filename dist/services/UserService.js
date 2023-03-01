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
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
const Review_1 = __importDefault(require("../models/Review"));
const User_1 = __importDefault(require("../models/User"));
const exceptionMessage_1 = __importDefault(require("../modules/exceptionMessage"));
const randomName_1 = __importDefault(require("../modules/randomName"));
const RestaurantService_1 = __importDefault(require("./RestaurantService"));
const ReviewService_1 = __importDefault(require("./ReviewService"));
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
const findUserById = (userId, social, agent) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({
            social: social,
            socialId: userId,
        });
        if (!user)
            return null;
        yield User_1.default.findByIdAndUpdate(user._id, { userAgent: agent });
        return user;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        if (error.message === "CastError")
            return null;
        throw error;
    }
});
const signUpUser = (social, socialId, email, refreshToken, agent) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let nickname = (yield randomName_1.default.createRandomName()).toString();
        const existName = yield User_1.default.find({
            name: {
                $regex: `.*${nickname}.*`,
            },
        });
        if (existName.length > 0)
            nickname = `${nickname}${existName.length + 1}`;
        const user = new User_1.default({
            name: nickname,
            social: social,
            socialId: socialId,
            email: email,
            scrapRestaurants: [],
            refreshToken: refreshToken,
            userAgent: agent,
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
        if (error.message === "CastError")
            return null;
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
        if (error.message === "CastError")
            return null;
        throw error;
    }
});
const scrapRestaurant = (userId, restaurantId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(userId);
        if (!user)
            return null;
        let scraps = user.scrapRestaurants;
        let isScrap;
        if (!scraps) {
            const data = [];
            data.push(restaurantId);
            yield User_1.default.findByIdAndUpdate(userId, {
                $set: { scrapRestaurants: data },
            });
            isScrap = true;
        }
        if (scraps.find((scrapId) => scrapId == restaurantId)) {
            scraps = scraps.filter((scrapId) => scrapId != restaurantId);
            yield User_1.default.findByIdAndUpdate(userId, {
                $set: { scrapRestaurants: scraps },
            });
            isScrap = false;
        }
        else {
            scraps.push(restaurantId);
            yield User_1.default.findByIdAndUpdate(userId, {
                $set: { scrapRestaurants: scraps },
            });
            isScrap = true;
        }
        const data = {
            userId: userId,
            restaurantId: restaurantId,
            isScrap: isScrap,
        };
        return data;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        if (error.message === "CastError")
            return null;
        throw error;
    }
});
const getUserScrapList = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(userId);
        if (!user)
            return null;
        const userScrap = user.scrapRestaurants;
        if (!userScrap)
            return [];
        const scrapList = [];
        const promises = userScrap.map((restaurantId) => __awaiter(void 0, void 0, void 0, function* () {
            const restaurant = yield Restaurant_1.default.findById(restaurantId).populate("category");
            if (restaurant) {
                const categories = [];
                const categoryPromises = restaurant.category.map((category) => __awaiter(void 0, void 0, void 0, function* () {
                    categories.push(category.title);
                }));
                yield Promise.all(categoryPromises);
                const score = yield RestaurantService_1.default.getScore(restaurant.review);
                const address = restaurant.address.split(" ");
                const data = {
                    _id: restaurant._id,
                    name: restaurant.name,
                    logo: restaurant.logo,
                    score: score,
                    category: categories,
                    latitude: restaurant.location.coordinates.at(1),
                    longtitude: restaurant.location.coordinates.at(0),
                    address: `${address[0]} ${address[1]}`,
                    isDiet: restaurant.isDiet,
                };
                scrapList.push(data);
            }
        }));
        yield Promise.all(promises);
        return scrapList;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        if (error.name === "CastError")
            return null;
        throw error;
    }
});
const getUserProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(userId);
        if (user == undefined)
            return null;
        const data = {
            _id: userId,
            name: user.name,
        };
        return data;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        if (error.message === "CastError")
            return null;
        throw error;
    }
});
const updateUserProfile = (userId, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(userId);
        if (!user)
            return null;
        const userName = yield User_1.default.findOne({ name: name });
        if (userName)
            return exceptionMessage_1.default.DUPLICATE_NAME;
        const result = yield User_1.default.findByIdAndUpdate(userId, { $set: { name: name } }, { new: true });
        if (!result)
            return null;
        const data = {
            _id: result._id,
            name: result.name,
        };
        return data;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        if (error.message === "CastError")
            return null;
        throw error;
    }
});
const withdrawUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(userId);
        if (!user)
            return null;
        const reviews = user.reviews;
        const promises = reviews.map((reviewId) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield ReviewService_1.default.deleteReview(String(reviewId));
            if (!result) {
                yield Review_1.default.findByIdAndDelete(reviewId);
            }
        }));
        yield Promise.all(promises);
        yield User_1.default.findByIdAndDelete(userId);
        return exceptionMessage_1.default.DELETE_USER;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        if (error.message === "CastError")
            return null;
        throw error;
    }
});
const hasReviewed = (userId, restaurantId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(userId);
        const restaurant = yield Restaurant_1.default.findById(restaurantId);
        if (!user || !restaurant)
            return null;
        const review = yield Review_1.default.findOne({
            writer: userId,
            restaurant: restaurantId,
        });
        let hasReview;
        if (review)
            hasReview = true;
        else
            hasReview = false;
        const data = {
            hasReview: hasReview,
        };
        return data;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        throw error;
    }
});
const updateAgent = (userId, agent) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findByIdAndUpdate(userId, {
            userAgent: agent,
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
    scrapRestaurant,
    getUserScrapList,
    getUserProfile,
    updateUserProfile,
    withdrawUser,
    hasReviewed,
    updateAgent,
};
//# sourceMappingURL=UserService.js.map