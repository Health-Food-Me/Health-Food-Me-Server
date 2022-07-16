import { logger } from "../config/winstonConfig";
import GetReviewsDto from "../controllers/dto/review/GetReviewsDto";
import ReveiwResponseDto from "../controllers/dto/review/ReviewResponseDto";
import IUser from "../interface/User";
import Restaurant from "../models/Restaurant";
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
      hashtag: {
        taste: review.hashtag.taste,
        good: review.hashtag.good,
      },
    };
  });
  return reviewDto;
};

const createReview = async (reviewResponseDto: ReveiwResponseDto) => {
  try {
    const review = new Review({
      restaurant: reviewResponseDto.restaurantId,
      writer: reviewResponseDto.writerId,
      score: reviewResponseDto.score,
      content: reviewResponseDto.content,
      image: reviewResponseDto.image,
      hashtag: reviewResponseDto.hashtag,
    });

    const data = await review.save();

    const restaurant = await Restaurant.findById(
      reviewResponseDto.restaurantId,
    );

    if (!restaurant) return null;

    const reviewList = restaurant.reviews;
    if (reviewList != undefined) {
      reviewList.push(data._id);
      await Restaurant.findByIdAndUpdate(reviewResponseDto.restaurantId, {
        $set: { reviews: reviewList }
      });
    } else {
        await Restaurant.findByIdAndUpdate(reviewResponseDto.restaurantId, {
          $set: { reviews: [data._id] }
        });
      }

    return data;
  } catch (error) {
    logger.e(error);
    throw error;
  }
};

export default {
  getReviewsByRestaurant,
  createReview,
};
