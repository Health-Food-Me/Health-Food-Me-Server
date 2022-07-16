import GetReviewsDto from "../controllers/dto/review/GetReviewsDto";
import IUser from "../interface/User";
import Review from "../models/Review";

const getReviewsByRestaurant = async (id: string) => {
  const reviews = await Review.find({
    restaurant: id,
  }).populate<{ writer: IUser }>("writer");

  const reviewDto: GetReviewsDto[] = reviews.map((review) => {
    return {
      writer: review.writer,
      score: review.score,
      content: review.content,
      image: review.image,
      reason: {
        taste: review.hashtag.taste,
        good: review.hashtag.good,
      },
    };
  });
  return reviewDto;
};

const getReviewsByUser = async (id: string) => {
  const reviews = await Review.find({
    writer: id,
  }).populate<{ writer: IUser }>("writer");

  const reviewDto: GetReviewsDto[] = reviews.map((review) => {
    return {
      writer: review.writer,
      score: review.score,
      content: review.content,
      image: review.image,
      reason: {
        taste: review.hashtag.taste,
        good: review.hashtag.good,
      },
    };
  });
  return reviewDto;
};

export default {
  getReviewsByRestaurant,
  getReviewsByUser,
};
