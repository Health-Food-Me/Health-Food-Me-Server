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
const Nutrient_1 = __importDefault(require("../models/Nutrient"));
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
const Review_1 = __importDefault(require("../models/Review"));
const User_1 = __importDefault(require("../models/User"));
const Prescription_1 = __importDefault(require("../models/Prescription"));
const getRestaurantSummary = (restaurantId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = yield Restaurant_1.default.findById(restaurantId);
        const category = yield Category_1.default.findById(restaurant === null || restaurant === void 0 ? void 0 : restaurant.category);
        const reviews = restaurant === null || restaurant === void 0 ? void 0 : restaurant.reviews;
        const user = yield User_1.default.findById(userId);
        const scraps = user === null || user === void 0 ? void 0 : user.scrapRestaurants;
        let score = 0;
        let review;
        if (reviews !== undefined) {
            const promises = reviews.map((reviewId) => __awaiter(void 0, void 0, void 0, function* () {
                review = yield Review_1.default.findById(reviewId);
                score = score + review.score;
            }));
            yield Promise.all(promises);
            if (reviews.length > 0) {
                score = Number((score / reviews.length).toFixed(1));
            }
        }
        let isScrap = false;
        if ((scraps === null || scraps === void 0 ? void 0 : scraps.find((x) => x == restaurantId)) !== undefined) {
            isScrap = true;
        }
        const data = {
            _id: restaurantId,
            name: restaurant === null || restaurant === void 0 ? void 0 : restaurant.name,
            logo: restaurant === null || restaurant === void 0 ? void 0 : restaurant.logo,
            category: category === null || category === void 0 ? void 0 : category.title,
            hashtag: restaurant === null || restaurant === void 0 ? void 0 : restaurant.hashtag,
            score: score,
            isScrap: isScrap,
        };
        return data;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        throw error;
    }
});
const getMenuDetail = (restaurantId, latitude, longtitude) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = yield Restaurant_1.default.findById(restaurantId);
        const category = yield Category_1.default.findById(restaurant === null || restaurant === void 0 ? void 0 : restaurant.category);
        const menuIdArray = restaurant === null || restaurant === void 0 ? void 0 : restaurant.menus;
        const restaurantLatitude = restaurant === null || restaurant === void 0 ? void 0 : restaurant.location.coordinates.at(0);
        const restaurantLongtitude = restaurant === null || restaurant === void 0 ? void 0 : restaurant.location.coordinates.at(1);
        const distance = yield getDistance(latitude, longtitude, restaurantLatitude, restaurantLongtitude);
        const menus = [];
        if (menuIdArray !== undefined) {
            const promise = menuIdArray === null || menuIdArray === void 0 ? void 0 : menuIdArray.map((menuId) => __awaiter(void 0, void 0, void 0, function* () {
                const menu = yield Menu_1.default.findById(menuId);
                const nutrient = yield Nutrient_1.default.findById(menu === null || menu === void 0 ? void 0 : menu.nutrient);
                const menuData = {
                    _id: menuId,
                    name: menu === null || menu === void 0 ? void 0 : menu.name,
                    image: menu === null || menu === void 0 ? void 0 : menu.image,
                    kcal: nutrient === null || nutrient === void 0 ? void 0 : nutrient.kcal,
                    carbohydrate: nutrient === null || nutrient === void 0 ? void 0 : nutrient.carbohydrate,
                    protein: nutrient === null || nutrient === void 0 ? void 0 : nutrient.protein,
                    fat: nutrient === null || nutrient === void 0 ? void 0 : nutrient.fat,
                    price: menu === null || menu === void 0 ? void 0 : menu.price,
                    isPick: menu === null || menu === void 0 ? void 0 : menu.isHelfoomePick,
                };
                menus.push(menuData);
            }));
            yield Promise.all(promise);
        }
        const data = {
            restaurant: {
                _id: restaurantId,
                distance: distance,
                name: restaurant === null || restaurant === void 0 ? void 0 : restaurant.name,
                logo: restaurant === null || restaurant === void 0 ? void 0 : restaurant.logo,
                category: category === null || category === void 0 ? void 0 : category.title,
                hashtag: restaurant === null || restaurant === void 0 ? void 0 : restaurant.hashtag,
                address: restaurant === null || restaurant === void 0 ? void 0 : restaurant.address,
                workTime: restaurant === null || restaurant === void 0 ? void 0 : restaurant.worktime,
                contact: restaurant === null || restaurant === void 0 ? void 0 : restaurant.contact,
            },
            menu: menus,
        };
        return data;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
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
    var _a, _b;
    try {
        const categoryId = (_a = (yield Restaurant_1.default.findById(restaurantId))) === null || _a === void 0 ? void 0 : _a.category;
        const prescription = yield Prescription_1.default.findOne({ category: categoryId });
        if (!prescription) {
            return null;
        }
        const data = {
            _id: prescription._id,
            category: (_b = (yield Category_1.default.findById(categoryId))) === null || _b === void 0 ? void 0 : _b.title,
            content: prescription.content,
        };
        return data;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
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