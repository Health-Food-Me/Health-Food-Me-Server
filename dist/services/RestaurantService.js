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
const Category_1 = __importDefault(require("../models/Category"));
const Menu_1 = __importDefault(require("../models/Menu"));
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
const Review_1 = __importDefault(require("../models/Review"));
const User_1 = __importDefault(require("../models/User"));
const Prescription_1 = __importDefault(require("../models/Prescription"));
const getRestaurantSummary = (restaurantId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = yield Restaurant_1.default.findById(restaurantId).populate("category");
        const user = yield User_1.default.findById(userId);
        if (!restaurant || !user) {
            return null;
        }
        const reviewList = restaurant.reviews;
        const score = yield getScore(reviewList);
        const scrapList = user === null || user === void 0 ? void 0 : user.scrapRestaurants;
        let isScrap = false;
        if ((scrapList === null || scrapList === void 0 ? void 0 : scrapList.find((x) => x == restaurantId)) !== undefined) {
            isScrap = true;
        }
        const data = {
            _id: restaurantId,
            name: restaurant === null || restaurant === void 0 ? void 0 : restaurant.name,
            logo: restaurant === null || restaurant === void 0 ? void 0 : restaurant.logo,
            category: restaurant === null || restaurant === void 0 ? void 0 : restaurant.category.title,
            hashtag: restaurant === null || restaurant === void 0 ? void 0 : restaurant.hashtag,
            score: score,
            isScrap: isScrap,
        };
        return data;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        if (error.name === "CastError") {
            return null;
        }
        throw error;
    }
});
const getScore = (reviewList) => __awaiter(void 0, void 0, void 0, function* () {
    if (reviewList == undefined) {
        return 0;
    }
    if (reviewList.length <= 0) {
        return 0;
    }
    let score = 0;
    const promises = reviewList.map((reviewId) => __awaiter(void 0, void 0, void 0, function* () {
        const review = yield Review_1.default.findById(reviewId);
        if (review != undefined) {
            score = score + (review === null || review === void 0 ? void 0 : review.score);
        }
    }));
    yield Promise.all(promises);
    score = Number((score / reviewList.length).toFixed(1));
    return score;
});
const getMenuDetail = (restaurantId, latitude, longtitude) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = yield Restaurant_1.default.findById(restaurantId).populate("category");
        if (!restaurant) {
            return null;
        }
        const restaurantLatitude = restaurant.location.coordinates.at(0);
        const restaurantLongtitude = restaurant.location.coordinates.at(1);
        const distance = yield getDistance(latitude, longtitude, restaurantLatitude, restaurantLongtitude);
        const menuIdList = restaurant.menus;
        const menuList = yield getMenuList(menuIdList);
        const data = {
            restaurant: {
                _id: restaurantId,
                distance: distance,
                name: restaurant === null || restaurant === void 0 ? void 0 : restaurant.name,
                logo: restaurant === null || restaurant === void 0 ? void 0 : restaurant.logo,
                category: restaurant === null || restaurant === void 0 ? void 0 : restaurant.category.title,
                hashtag: restaurant === null || restaurant === void 0 ? void 0 : restaurant.hashtag,
                address: restaurant === null || restaurant === void 0 ? void 0 : restaurant.address,
                workTime: restaurant === null || restaurant === void 0 ? void 0 : restaurant.worktime,
                contact: restaurant === null || restaurant === void 0 ? void 0 : restaurant.contact,
            },
            menu: menuList,
        };
        return data;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        if (error.name === "CastError") {
            return null;
        }
        throw error;
    }
});
const getDistance = (lat1, lon1, lat2, lon2) => __awaiter(void 0, void 0, void 0, function* () {
    if (lat1 == lat2 && lon1 == lon2)
        return 0;
    const radLat1 = (Math.PI * lat1) / 180;
    const radLat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radTheta = (Math.PI * theta) / 180;
    let dist = Math.sin(radLat1) * Math.sin(radLat2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
    if (dist > 1)
        dist = 1;
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515 * 1.609344 * 1000;
    if (dist < 100)
        dist = Math.round(dist / 10) * 10;
    else
        dist = Math.round(dist / 100) * 100;
    return dist;
});
const getMenuList = (menuIdList) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (menuIdList == undefined) {
            return [];
        }
        if (menuIdList.length <= 0) {
            return [];
        }
        const menuList = [];
        const promises = menuIdList.map((menuId) => __awaiter(void 0, void 0, void 0, function* () {
            const menu = yield Menu_1.default.findById(menuId).populate("nutrient");
            const menuData = {
                _id: menuId,
                name: menu === null || menu === void 0 ? void 0 : menu.name,
                image: menu === null || menu === void 0 ? void 0 : menu.image,
                kcal: menu === null || menu === void 0 ? void 0 : menu.nutrient.kcal,
                carbohydrate: menu === null || menu === void 0 ? void 0 : menu.nutrient.carbohydrate,
                protein: menu === null || menu === void 0 ? void 0 : menu.nutrient.protein,
                fat: menu === null || menu === void 0 ? void 0 : menu.nutrient.fat,
                price: menu === null || menu === void 0 ? void 0 : menu.price,
                isPick: menu === null || menu === void 0 ? void 0 : menu.isHelfoomePick,
            };
            menuList.push(menuData);
        }));
        yield Promise.all(promises);
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        if (error.name === "CastError") {
            return null;
        }
        throw error;
    }
});
const getAroundRestaurants = (longitude, latitude, zoom) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurants = yield Restaurant_1.default.find({
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude],
                },
                $maxDistance: zoom,
            },
        }).populate("category");
        const results = restaurants.map((restaurant) => {
            return {
                _id: restaurant._id,
                name: restaurant.name,
                longitude: restaurant.location.coordinates.at(1),
                latitude: restaurant.location.coordinates.at(0),
                isDietRestaurant: restaurant.category.isDiet,
            };
        });
        return results;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        throw error;
    }
});
const getPrescription = (restaurantId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = yield Restaurant_1.default.findById(restaurantId);
        if (restaurant == undefined) {
            return null;
        }
        const category = yield Category_1.default.findById(restaurant.category);
        if (category == undefined) {
            throw new Error("no category");
        }
        if (category.prescription == undefined) {
            const data = {
                category: category.title,
                content: null,
            };
            return data;
        }
        const prescription = yield Prescription_1.default.findById(category.prescription);
        const content = prescription === null || prescription === void 0 ? void 0 : prescription.content;
        if (content == undefined) {
            throw new Error("no content of the prescription");
        }
        const data = {
            category: category.title,
            content: content,
        };
        return data;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        if (error.name === "CastError") {
            return null;
        }
        throw error;
    }
});
exports.default = {
    getRestaurantSummary,
    getMenuDetail,
    getAroundRestaurants,
    getPrescription,
};
//# sourceMappingURL=RestaurantService.js.map