import { Types } from "mongoose";
import configMongoose from "../config/mongooseConfig";
import UserService from "../services/UserService";

describe("유저 프로필 조회 테스트", () => {
  test("GET /user/:userId/profile", async () => {
    configMongoose();
    const user = await UserService.getUserProfile("62d1c081c4beaf1e397b5d40");
    expect(user?._id).toBe("62d1c081c4beaf1e397b5d40");
    expect(user?.name).toBe("문다빙빙");
  });
});

describe("유저 프로필 수정 테스트", () => {
  test("PUT /user/:userId/profile", async () => {
    configMongoose();
    const user = await UserService.updateUserProfile(
      "62d1c081c4beaf1e397b5d40",
      "다빙빙",
    );
    const result = {
      _id: "62d1c081c4beaf1e397b5d40",
      name: "다빙빙",
      scrapRestaurants: [],
    };
    expect(user).toStrictEqual(result);
  });
});

describe("유저 식당 스크랩 테스트", () => {
  test("PUT user/:userId/scrap/:restaurantId", async () => {
    configMongoose();
    const scrapList = await UserService.scrapRestaurant("62d1c081c4beaf1e397b5d40", "62d26c9bd11146a81ef18ea6");
    if (scrapList != undefined) scrapList[0] = scrapList[0].toString();
    console.log(scrapList);
    expect(scrapList).toBeTruthy();
  });
});

describe("유저 스크랩한 식당 리스트 조회", () => {
  test("GET user/:userId/scrapList", async () => {
    configMongoose();
    const restaurantList = await UserService.getUserScrapList("62d1c081c4beaf1e397b5d40");
    if(restaurantList!=undefined) restaurantList[0]._id = restaurantList[0]._id.toString();
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
  })
})
