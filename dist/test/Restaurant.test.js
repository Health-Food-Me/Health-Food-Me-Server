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
const mongooseConfig_1 = __importDefault(require("../config/mongooseConfig"));
const RestaurantService_1 = __importDefault(require("../services/RestaurantService"));
describe("식당 자동 검색", () => {
    test("GET /restaurant/search/auto?query={검색어}", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, mongooseConfig_1.default)();
        const restaurantList = yield RestaurantService_1.default.getSearchAutoCompleteResult("샐");
        restaurantList.map((restaurant) => {
            restaurant._id = restaurant._id.toString();
        });
        expect(restaurantList.length).toBe(9);
    }));
});
describe("식당 검색 결과", () => {
    test("GET /reataurant/search/card?longitude={경도}&latitude={위도}&keyword={검색어}", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, mongooseConfig_1.default)();
        const restaurantList = yield RestaurantService_1.default.getRestaurantCardList(127, 37.5, "고소미부엌 논현본점");
        expect(restaurantList.length).toBe(1);
    }));
});
describe("메뉴 상세 조회", () => {
    test("GET /restaurant/:restaurantId/:userId/menus?longitude={경도}&latitude={위도}", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        (0, mongooseConfig_1.default)();
        const menuList = yield RestaurantService_1.default.getMenuDetail("62d26c9bd11146a81ef18eaf", "62d1c081c4beaf1e397b5d40", 37.5, 127);
        expect((_a = menuList === null || menuList === void 0 ? void 0 : menuList.menu) === null || _a === void 0 ? void 0 : _a.length).toBe(15);
    }));
});
describe("주변 식당 검색", () => {
    test("GET /restaurant?longitude={경도}&latitude={위도}&zoom={최대반경}&category={카테고리}", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, mongooseConfig_1.default)();
        const restaurantList = yield RestaurantService_1.default.getAroundRestaurants(127, 37.5, 30000, "샐러드");
        expect(restaurantList.length).toBe(8);
    }));
});
describe("외식대처법 조회", () => {
    test("GET /restaurant/:restaurantId/prescription", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, mongooseConfig_1.default)();
        const prescription = yield RestaurantService_1.default.getPrescription("62d96436f683b758eb97ca33");
        expect(prescription === null || prescription === void 0 ? void 0 : prescription.category).toBe("샤브샤브");
    }));
});
describe("식당 요약 정보 조회", () => {
    test("GET /restaurant/:restaurantId/:userId", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, mongooseConfig_1.default)();
        const restaurant = yield RestaurantService_1.default.getRestaurantSummary("62d96436f683b758eb97ca27", "62d1c081c4beaf1e397b5d40");
        expect(restaurant === null || restaurant === void 0 ? void 0 : restaurant.name).toBe("걸신맛집");
    }));
});
//# sourceMappingURL=Restaurant.test.js.map