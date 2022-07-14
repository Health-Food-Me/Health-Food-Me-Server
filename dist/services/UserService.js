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
const exceptionMessage_1 = __importDefault(require("../modules/exceptionMessage"));
const SocialAuthStrategy_1 = require("./SocialAuthStrategy");
const RestaurantService_1 = __importDefault(require("./RestaurantService"));
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
        let user;
        if (!email) {
            user = new User_1.default({
                name: `헬푸미${socialId}`,
                social: social,
                socialId: socialId,
                scrapRestaurants: [],
                refreshToken: refreshToken,
            });
        }
        else {
            user = new User_1.default({
                name: `헬푸미${socialId}`,
                social: social,
                socialId: socialId,
                email: email,
                scrapRestaurants: [],
                refreshToken: refreshToken,
            });
        }
        console.log(user);
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
const scrapRestaurant = (userId, restaurantId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(userId);
    let scraps = user === null || user === void 0 ? void 0 : user.scrapRestaurants;
    if (scraps === null || scraps === void 0 ? void 0 : scraps.find((x) => x == restaurantId)) {
        scraps = scraps.filter((restaurantId) => restaurantId !== restaurantId);
        yield User_1.default.findByIdAndUpdate(userId, {
            $set: { scrapRestaurants: scraps },
        });
        return false;
    }
    else {
        scraps === null || scraps === void 0 ? void 0 : scraps.push(restaurantId);
        yield User_1.default.findByIdAndUpdate(userId, {
            $set: { scrapRestaurants: scraps },
        });
        return true;
    }
});
const getUserScrpaList = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(userId);
    const userScrap = user === null || user === void 0 ? void 0 : user.scrapRestaurants;
    const scrapList = [];
    if (userScrap !== undefined) {
        const promise = userScrap.map((restaurantId) => __awaiter(void 0, void 0, void 0, function* () {
            const restaurant = yield RestaurantService_1.default.getRestaurantSummary(restaurantId, userId);
            const data = {
                _id: restaurant._id,
                name: restaurant.name,
                logo: restaurant.logo,
                score: restaurant.score,
                category: restaurant.category,
            };
            scrapList.push(data);
        }));
        yield Promise.all(promise);
    }
    return scrapList;
});
const getUserProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(userId);
        const data = {
            _id: userId,
            name: user === null || user === void 0 ? void 0 : user.name,
        };
        return data;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        throw error;
    }
});
const updateUserProfile = (userId, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield User_1.default.findById(userId);
        if (!user) {
            return null;
        }
        const userName = yield User_1.default.findOne({ name: name });
        if (userName) {
            return exceptionMessage_1.default.DUPLICATE_NAME;
        }
        yield User_1.default.findByIdAndUpdate(userId, {
            $set: { name: name },
        });
        user = yield User_1.default.findById(userId);
        const data = {
            _id: userId,
            name: user === null || user === void 0 ? void 0 : user.name,
        };
        return data;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        throw error;
    }
});
const withdrawUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return null;
        }
        yield User_1.default.findByIdAndDelete(userId);
        return exceptionMessage_1.default.DELETE_USER;
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
    getUserScrpaList,
    getUserProfile,
    updateUserProfile,
    withdrawUser,
};
//# sourceMappingURL=UserService.js.map