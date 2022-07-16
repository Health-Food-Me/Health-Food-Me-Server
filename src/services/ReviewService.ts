import GetReviewsDto from "../controllers/dto/review/GetReviewsDto";
import IUser from "../interface/User";
import Review from "../models/Review";

const getReviewsByRestaurant = async (id: string) => {
  const reviews = await Review.find({
    restaurantId: id,
  }).populate<{ writerId: IUser }>("writerId");

  const reviewDto: GetReviewsDto[] = reviews.map((review) => {
    return {
      writer: review.writerId,
      score: review.score,
      content: review.content,
      image: review.image,
      reason: {
        taste: review.reason.taste,
        good: review.reason.good,
      },
    };
  });
  return reviewDto;
};

export default {
  getReviewsByRestaurant,
};
