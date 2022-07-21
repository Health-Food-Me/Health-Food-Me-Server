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
const UserService_1 = __importDefault(require("../services/UserService"));
describe("유저 프로필 조회 테스트", () => {
    test("GET /user/:userId/profile", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, mongooseConfig_1.default)();
        const user = yield UserService_1.default.getUserProfile("62d1c081c4beaf1e397b5d40");
        expect(user === null || user === void 0 ? void 0 : user._id).toBe("62d1c081c4beaf1e397b5d40");
        expect(user === null || user === void 0 ? void 0 : user.name).toBe("문다빙빙");
    }));
});
describe("유저 프로필 수정 테스트", () => {
    test("PUT /user/:userId/profile", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, mongooseConfig_1.default)();
        const user = yield UserService_1.default.updateUserProfile("62d1c081c4beaf1e397b5d40", "다빙빙");
        const result = {
            _id: "62d1c081c4beaf1e397b5d40",
            name: "다빙빙",
            scrapRestaurants: [],
        };
        expect(user).toStrictEqual(result);
    }));
});
describe("유저 식당 스크랩 테스트", () => {
    test("PUT user/:userId/scrap/:restaurantId", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, mongooseConfig_1.default)();
        const scrapList = yield UserService_1.default.scrapRestaurant("62d1c081c4beaf1e397b5d40", "62d26c9bd11146a81ef18ea6");
        if (scrapList != undefined)
            scrapList[0] = scrapList[0].toString();
        console.log(scrapList);
        expect(scrapList).toBeTruthy();
    }));
});
describe("유저 스크랩한 식당 리스트 조회", () => {
    test("GET user/:userId/scrapList", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, mongooseConfig_1.default)();
        const restaurantList = yield UserService_1.default.getUserScrapList("62d1c081c4beaf1e397b5d40");
        if (restaurantList != undefined) {
            restaurantList[0]._id = restaurantList[0]._id.toString();
        }
        const result = [
            {
                _id: "62d26c9bd11146a81ef18ea6",
                name: "샐러디 서울시청점",
                logo: "logo샐러디 서울시청점",
                score: 3.5,
                category: "샐러드",
                hashtag: [],
                latitude: 37.5091599,
                longtitude: 127.1111142,
                address: "서울특별시 송파구",
            },
        ];
        expect(restaurantList).toStrictEqual(result);
    }));
});
//# sourceMappingURL=User.test.js.map