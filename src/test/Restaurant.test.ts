import configMongoose from "../config/mongooseConfig";
import RestaurantService from "../services/RestaurantService";

describe("식당 자동 검색", () => {
  test("GET /restaurant/search/auto?query={검색어}", async () => {
    configMongoose();
    const restaurantList = await RestaurantService.getSearchAutoCompleteResult(
      "샐",
    );
    restaurantList.map((restaurant) => {
      restaurant._id = restaurant._id.toString();
    });

    expect(restaurantList.length).toBe(9);
  });
});

describe("식당 검색 결과", () => {
  test("GET /reataurant/search/card?longitude={경도}&latitude={위도}&keyword={검색어}", async () => {
    configMongoose();
    const restaurantList = await RestaurantService.getRestaurantCardList(
      127,
      37.5,
      "고소미부엌 논현본점",
    );

    expect(restaurantList.length).toBe(1);
  });
});

describe("메뉴 상세 조회", () => {
  test("GET /restaurant/:restaurantId/:userId/menus?longitude={경도}&latitude={위도}", async () => {
    configMongoose();
    const menuList = await RestaurantService.getMenuDetail(
      "62d26c9bd11146a81ef18eaf",
      "62d1c081c4beaf1e397b5d40",
      37.5,
      127,
    );

    expect(menuList?.menu?.length).toBe(15);
  });
});

describe("주변 식당 검색", () => {
  test("GET /restaurant?longitude={경도}&latitude={위도}&zoom={최대반경}&category={카테고리}", async () => {
    configMongoose();
    const restaurantList = await RestaurantService.getAroundRestaurants(
      127,
      37.5,
      30000,
      "샐러드",
    );

    expect(restaurantList.length).toBe(8);
  });
});

describe("외식대처법 조회", () => {
  test("GET /restaurant/:restaurantId/prescription", async () => {
    configMongoose();
    const prescription = await RestaurantService.getPrescription(
      "62d96436f683b758eb97ca33",
    );

    expect(prescription?.category).toBe("샤브샤브");
  });
});

describe("식당 요약 정보 조회", () => {
  test("GET /restaurant/:restaurantId/:userId", async () => {
    configMongoose();
    const restaurant = await RestaurantService.getRestaurantSummary(
      "62d96436f683b758eb97ca27",
      "62d1c081c4beaf1e397b5d40",
    );

    expect(restaurant?.name).toBe("걸신맛집");
  });
});
