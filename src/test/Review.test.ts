import configMongoose from "../config/mongooseConfig";
import Review from "../models/Review";
import ReviewService from "../services/ReviewService";

describe("리뷰 작성", () => {
  test("POST review/user/:userId/restaurant/:restaurantId", async () => {
    configMongoose();
    const data = {
      restaurantId: "62d26c9bd11146a81ef18eaf",
      writerId: "62d9ab65d7499a033b92bcea",
      reviewId: "",
      score: 4.8,
      taste: "# 맛 최고",
      good: ["# 약속 시 부담 없는"],
      content: "리뷰 테스트",
      image: [],
      nameList: [],
    };

    const result = await ReviewService.createReview(data);

    expect(result?._id).toBeTruthy();
  });
});

describe("식당 리뷰 조회", () => {
  test("GET review/restaurant/:restaurantId", async () => {
    configMongoose();
    const result = await ReviewService.getReviewsByRestaurant(
      "62d26c9bd11146a81ef18eaf",
    );

    expect(result.length).toBe(5);
  });
});

describe("유저 리뷰 조회", () => {
  test("GET review/user/:userId", async () => {
    configMongoose();
    const result = await ReviewService.getReviewsByUser(
      "62d1c081c4beaf1e397b5d40",
    );

    expect(result.length).toBe(2);
  });
});

describe("네이버 리뷰 조회", () => {
  test("GET review/restaurant/:name/blog", async () => {
    configMongoose();
    const result = await ReviewService.getReviewsFromNaver(
      "고소미부엌 논현본점",
    );

    expect(result).toBeTruthy();
  });
});

describe("리뷰 수정", () => {
  test("PUT review/:reviewId", async () => {
    configMongoose();
    const data = {
      restaurantId: "",
      writerId: "",
      reviewId: "62d97e73c6f9c44a026736e2",
      score: 3.5,
      taste: "맛 최고",
      good: ["약속 시 부담 없는"],
      content: "리뷰 수정 테스트",
      image: [],
      nameList: [],
    };
    const result = await ReviewService.updateReview(data);

    expect(result?.content).toBe("리뷰 수정 테스트");
  });
});

describe("리뷰 삭제", () => {
  test("DELETE review/:reviewId", async () => {
    configMongoose();
    await ReviewService.deleteReview("62d97e73c6f9c44a026736e2");
    const result = await Review.findById("62d97e73c6f9c44a026736e2");

    expect(result).toBeTruthy();
  });
});
