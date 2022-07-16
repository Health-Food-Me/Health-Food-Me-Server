import axios from "axios";
import multer from "../config/multer";
import { logger } from "../config/winstonConfig";
import GetReviewsDto from "../controllers/dto/review/GetReviewsDto";
import ReveiwResponseDto from "../controllers/dto/review/ReviewResponseDto";
import { NaverBlogReviewResponse } from "../interface/Review";
import IUser from "../interface/User";
import Restaurant from "../models/Restaurant";
import Review from "../models/Review";

const getReviewsByRestaurant = async (id: string) => {
  const reviews = await Review.find({
    restaurant: id,
  }).populate<{ writer: IUser }>("writer");

  const reviewDto: GetReviewsDto[] = reviews.map((review) => {
    return {
      id: review._id,
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

const getReviewsByUser = async (id: string) => {
  const reviews = await Review.find({
    writer: id,
  }).populate<{ writer: IUser }>("writer");

  const reviewDto: GetReviewsDto[] = reviews.map((review) => {
    return {
      id: review._id,
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

const deleteReview = async (id: string, restaurantId: string) => {
  const restaurant = await Restaurant.findById(restaurantId);

  if (restaurant == undefined) return null;

  let reviewList = restaurant.reviews;
  console.log(reviewList);
  reviewList = reviewList.filter((review) => { review != id });
  console.log(reviewList);
  
  await Restaurant.findByIdAndUpdate(restaurantId, {
    $set: { reviews: reviewList }
  });
/*
  await Review.deleteOne({ _id: id });
  */
};

const getReviewsFromNaver = async (name: string) => {
  const encodedName = encodeURI(name);
  const requestUrl = `https://openapi.naver.com/v1/search/blog?query=${encodedName}`;
  const result = await axios.get<NaverBlogReviewResponse>(requestUrl, {
    headers: {
      "X-Naver-Client-Id": "SG2hLClLCFrOIl5uQh3y",
      "X-Naver-Client-Secret": "xwsh8rft0T",
    },
  });

  const blogReviews: NaverBlogReviewResponse = {
    start: result.data.start,
    display: result.data.display,
    items: result.data.items,
  };
  return blogReviews;
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
        $set: { reviews: reviewList },
      });
    } else {
      await Restaurant.findByIdAndUpdate(reviewResponseDto.restaurantId, {
        $set: { reviews: [data._id] },
      });
    }

    return data;
  } catch (error) {
    logger.e(error);
    throw error;
  }
};

const updateReview = async (reviewResponseDto: ReveiwResponseDto) => {
  try {
    const reviewId = reviewResponseDto.reviewId;
    const review = await Review.findById(reviewId);

    if (review == undefined) return null;

    const imageFileList = review.image;
    let imageList: { name: string, url: string }[] = [];
    
    const promises = imageFileList.map(async (file) => {
      if (reviewResponseDto.nameList.includes(file.name)) {
        imageList.push(file);
      } else {
        await multer.s3Delete(file.url);
      }
    });
    await Promise.all(promises);

    const promiseMerge = reviewResponseDto.image.map(async (image) => {
      imageList.push(image)
    });
    await Promise.all(promiseMerge);

    console.log(imageList);

    await Review.findByIdAndUpdate(reviewResponseDto.reviewId, {
      $set: {
        score: reviewResponseDto.score,
        hashtag: reviewResponseDto.hashtag,
        content: reviewResponseDto.content,
        image: imageList,
      }
    });

    const result = await Review.findById(reviewId);
    
    return result;

  } catch (error) {
    logger.e(error);
    throw error;
  }
}

export default {
  getReviewsByRestaurant,
  createReview,
  getReviewsByUser,
  deleteReview,
  getReviewsFromNaver,
  updateReview,
};
