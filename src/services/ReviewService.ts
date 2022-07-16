import IUser from "../interface/User";
import Review from "../models/Review";

const getReviewsByRestaurant = async (id: string) => {
  const reivews = await Review.find({
    restaurantId: id,
  }).populate<{ writer: IUser }>("writerId");

  return reivews;
};
