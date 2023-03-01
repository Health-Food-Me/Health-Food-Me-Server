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
const Prescription_1 = __importDefault(require("../models/Prescription"));
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
const Review_1 = __importDefault(require("../models/Review"));
const User_1 = __importDefault(require("../models/User"));
const exceptionMessage_1 = __importDefault(require("../modules/exceptionMessage"));
const getRestaurantSummary = (restaurantId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = yield Restaurant_1.default.findById(restaurantId).populate("category");
        if (!restaurant)
            return null;
        const categories = [];
        const categoryList = restaurant.category;
        categoryList.map((category) => __awaiter(void 0, void 0, void 0, function* () {
            categories.push(category.title);
        }));
        const reviewList = restaurant.review;
        const score = yield getScore(reviewList);
        let isScrap = false;
        if (userId !== "browsing") {
            const user = yield User_1.default.findById(userId);
            if (!user)
                return null;
            const scrapList = user.scrapRestaurants;
            if ((scrapList === null || scrapList === void 0 ? void 0 : scrapList.find((x) => x == restaurantId)) !== undefined) {
                isScrap = true;
            }
        }
        const data = {
            _id: restaurantId,
            name: restaurant.name,
            longitude: restaurant.location.coordinates.at(0),
            latitude: restaurant.location.coordinates.at(1),
            logo: restaurant.logo,
            category: categories,
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
const getMenuDetail = (restaurantId, userId, latitude, longtitude) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = yield Restaurant_1.default.findById(restaurantId).populate("category");
        if (!restaurant)
            return null;
        // 영업시간 월-일 순으로 정렬
        const workTime = [];
        const restaurantTime = restaurant.workTime;
        if (restaurantTime) {
            restaurant.workTime.map((time) => __awaiter(void 0, void 0, void 0, function* () {
                if (time.length == 15) {
                    workTime.push(`${time.split(" ")[1]} - ${time.split(" ")[3]}`);
                }
                else
                    workTime.push(time.split(" ")[1]);
            }));
        }
        // 카테고리 title 정렬
        const categories = [];
        restaurant.category.map((category) => __awaiter(void 0, void 0, void 0, function* () {
            categories.push(category.title);
        }));
        // 식당까지의 거리 계산
        const restaurantLatitude = restaurant.location.coordinates.at(1);
        const restaurantLongtitude = restaurant.location.coordinates.at(0);
        const distance = yield getDistance(latitude, longtitude, restaurantLatitude, restaurantLongtitude);
        // 리뷰 기반으로 평점 계싼
        const reviewList = restaurant.review;
        const score = yield getScore(reviewList);
        // 유저 스크랩 여부 판단 (둘러보기 경우 false)
        let isScrap = false;
        if (userId !== "browsing") {
            const user = yield User_1.default.findById(userId);
            if (!user)
                return null;
            let scrapList = user.scrapRestaurants;
            if (!scrapList)
                scrapList = [];
            if (scrapList.find((x) => x == restaurantId) !== undefined) {
                isScrap = true;
            }
        }
        // 식당 메뉴 배열
        const menuIdList = restaurant.menu;
        const menuList = yield getMenuList(menuIdList);
        const data = {
            restaurant: {
                _id: restaurantId,
                name: restaurant.name,
                address: restaurant.address,
                workTime: workTime,
                contact: restaurant.contact,
                category: categories,
                isDiet: restaurant.isDiet,
                logo: restaurant.logo,
                menuBoard: restaurant.menuBoard,
                distance: distance,
                score: score,
                isScrap: isScrap,
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
        if (!menuIdList)
            return [];
        const menuList = [];
        const promises = menuIdList.map((menuId) => __awaiter(void 0, void 0, void 0, function* () {
            const menu = yield Menu_1.default.findById(menuId);
            if (menu) {
                const menuData = {
                    _id: menuId,
                    name: menu.name,
                    image: menu.image,
                    kcal: menu.kcal,
                    per: menu.per,
                    price: menu.price,
                    isPick: menu.isPick,
                };
                menuList.push(menuData);
            }
        }));
        yield Promise.all(promises);
        return menuList;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        if (error.name === "CastError") {
            return null;
        }
        throw error;
    }
});
// CICD TEST
const getAroundRestaurants = (longitude, latitude, zoom, category) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locationQuery = {
            location: {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: zoom,
                },
            },
        };
        const query = [locationQuery];
        let noCategory = false;
        if (category) {
            const result = yield Category_1.default.findOne({ title: category });
            if (!result)
                noCategory = true;
            else
                query.push({ category: { $in: result._id } });
        }
        if (noCategory)
            return exceptionMessage_1.default.NO_CATEGORY;
        const restaurants = yield Restaurant_1.default.find({
            $and: query,
        }).populate("category");
        const results = restaurants.map((restaurant) => {
            return {
                _id: restaurant._id,
                name: restaurant.name,
                longitude: restaurant.location.coordinates.at(0),
                latitude: restaurant.location.coordinates.at(1),
                isDietRestaurant: restaurant.isDiet,
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
        const restaurant = yield Restaurant_1.default.findById(restaurantId).populate("category");
        if (!restaurant)
            return null;
        const result = [];
        const promises = restaurant.category.map((category) => __awaiter(void 0, void 0, void 0, function* () {
            if (!category.prescription) {
                result.push({
                    category: category.title,
                    prescription: {
                        recommend: [],
                        tip: [],
                    },
                });
            }
            else {
                const prescription = yield Prescription_1.default.findById(category.prescription);
                if (prescription) {
                    result.push({
                        category: category.title,
                        prescription: {
                            recommend: prescription.recommend,
                            tip: prescription.tip,
                        },
                    });
                }
            }
        }));
        yield Promise.all(promises);
        return result;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        if (error.name === "CastError") {
            return null;
        }
        throw error;
    }
});
const getRestaurantCardList = (longitude, latitude, keyword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchCategory = yield Category_1.default.findOne({ title: keyword });
        const query = [{ name: { $regex: `.*${keyword}.*` } }];
        if (searchCategory) {
            query.push({ category: { $in: searchCategory._id } });
        }
        const searchList = yield Restaurant_1.default.find({
            $or: query,
        }).populate("category");
        const result = [];
        const promises = searchList.map((restaurant) => __awaiter(void 0, void 0, void 0, function* () {
            const categories = restaurant.category;
            const categoryList = categories.map((category) => {
                return category.title;
            });
            const score = yield getScore(restaurant.review);
            const distance = yield getDistance(latitude, longitude, restaurant.location.coordinates.at(1), restaurant.location.coordinates.at(0));
            const data = {
                _id: restaurant._id,
                name: restaurant.name,
                category: categoryList,
                score: score,
                distance: distance,
                longitude: restaurant.location.coordinates.at(0),
                latitude: restaurant.location.coordinates.at(1),
                logo: restaurant.logo,
                isDiet: restaurant.isDiet,
            };
            result.push(data);
        }));
        yield Promise.all(promises);
        result.sort(function (a, b) {
            return a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0;
        });
        return result;
    }
    catch (error) {
        winstonConfig_1.logger.e(error);
        throw error;
    }
});
const getSearchAutoCompleteResult = (longitude, latitude, query) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryList = yield Category_1.default.find({
        title: { $regex: query },
    });
    const result = [];
    let promises = categoryList.map((category) => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            _id: category._id,
            name: category.title,
            isDiet: category.isDiet,
            isCategory: true,
            distance: 0,
            longitude: 0,
            latitude: 0,
        };
        result.push(data);
    }));
    yield Promise.all(promises);
    const restaurantList = yield Restaurant_1.default.find({
        name: { $regex: query },
    }).populate("category");
    promises = restaurantList.map((restaurant) => __awaiter(void 0, void 0, void 0, function* () {
        const distance = yield getDistance(latitude, longitude, restaurant.location.coordinates.at(1), restaurant.location.coordinates.at(0));
        const data = {
            _id: restaurant._id,
            name: restaurant.name,
            isDiet: restaurant.isDiet,
            isCategory: false,
            distance: distance,
            longitude: restaurant.location.coordinates.at(0),
            latitude: restaurant.location.coordinates.at(1),
        };
        result.push(data);
    }));
    yield Promise.all(promises);
    result.sort(function (a, b) {
        return a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0;
    });
    return result;
});
const searchCategoryRestaurantList = (longitude, latitude, category) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryData = yield Category_1.default.findOne({ title: category });
        if (!categoryData)
            return null;
        const searchList = yield Restaurant_1.default.find({
            category: { $in: [categoryData._id] },
        }).populate("category");
        const result = [];
        const promises = searchList.map((restaurant) => __awaiter(void 0, void 0, void 0, function* () {
            const categories = restaurant.category.map((data) => {
                return data.title;
            });
            const score = yield getScore(restaurant.review);
            const distance = yield getDistance(latitude, longitude, restaurant.location.coordinates.at(1), restaurant.location.coordinates.at(0));
            const data = {
                _id: restaurant._id,
                category: categories,
                name: restaurant.name,
                score: score,
                distance: distance,
                longitude: restaurant.location.coordinates.at(0),
                latitude: restaurant.location.coordinates.at(1),
                logo: restaurant.logo,
                isDiet: restaurant.isDiet,
            };
            result.push(data);
        }));
        yield Promise.all(promises);
        result.sort(function (a, b) {
            return a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0;
        });
        return result;
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
    getRestaurantCardList,
    getScore,
    getSearchAutoCompleteResult,
    searchCategoryRestaurantList,
};
//# sourceMappingURL=RestaurantService.js.map