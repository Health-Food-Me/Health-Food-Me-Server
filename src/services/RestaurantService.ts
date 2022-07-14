import { logger } from "../config/winstonConfig";
import MenuData from "../interface/menuData";
import AroundRestaurantDto from "../controllers/dto/restaurant/AroundRestaurantDto";
import ICategory from "../interface/Category";
import IReview from "../interface/Review";
import Category from "../models/Category";
import Menu from "../models/Menu";
import Nutrient from "../models/Nutrient";
import Restaurant from "../models/Restaurant";
import Review from "../models/Review";
import User from "../models/User";
import Prescription from "../models/Prescription";

const getRestaurantSummary = async (restaurantId: string, userId: string) => {
  try {
    const restaurant = await Restaurant.findById(restaurantId).populate<{
      category: ICategory;
    }>("category");

    // 1. 찾는 식당 없는 예외처리 (404)

    //const restaurant = await Restaurant.findById(restaurantId);
    //const category = await Category.findById(restaurant?.category);
    const reviewList = restaurant?.reviews;

    // 2. 식당에 리뷰가 없는 경우 => score: 0

    // 리뷰 평점을 계산하는 함수 로직 따로 빼내는 방법으로 개선해볼 것

    const user = await User.findById(userId);

    // 3. 로그인한 유저 정보가 존재하지 않는 예외처리 (404)

    const scrapList = user?.scrapRestaurants;

    let score = 0;
    let review;
    if (reviewList !== undefined) {
      const promises = reviewList.map(async (reviewId) => {
        review = await Review.findById(reviewId);
        score = score + (review as IReview).score;
      });
      await Promise.all(promises);

      if (reviewList.length > 0) {
        score = Number((score / reviewList.length).toFixed(1));
      }
    }

    let isScrap = false;
    if (scrapList?.find((x) => x == restaurantId) !== undefined) {
      isScrap = true;
    }

    const data = {
      _id: restaurantId,
      name: restaurant?.name,
      logo: restaurant?.logo,
      category: restaurant?.category.title,
      hashtag: restaurant?.hashtag,
      score: score,
      isScrap: isScrap,
    };

    return data;
  } catch (error) {
    logger.e(error);
    throw error;
  }
};

const getMenuDetail = async (
  restaurantId: string,
  latitude: number,
  longtitude: number,
) => {
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    const category = await Category.findById(restaurant?.category);
    const menuIdArray = restaurant?.menus;
    const restaurantLatitude = restaurant?.location.coordinates.at(0);
    const restaurantLongtitude = restaurant?.location.coordinates.at(1);

    const distance = await getDistance(
      latitude,
      longtitude,
      restaurantLatitude as number,
      restaurantLongtitude as number,
    );

    const menus: MenuData[] = [];
    if (menuIdArray !== undefined) {
      const promise = menuIdArray?.map(async (menuId) => {
        const menu = await Menu.findById(menuId);
        const nutrient = await Nutrient.findById(menu?.nutrient);

        const menuData: MenuData = {
          _id: menuId,
          name: menu?.name as string,
          image: menu?.image as string,
          kcal: nutrient?.kcal as number,
          carbohydrate: nutrient?.carbohydrate as number,
          protein: nutrient?.protein as number,
          fat: nutrient?.fat as number,
          price: menu?.price as number,
          isPick: menu?.isHelfoomePick as boolean,
        };

        menus.push(menuData);
      });
      await Promise.all(promise);
    }

    const data = {
      restaurant: {
        _id: restaurantId,
        distance: distance,
        name: restaurant?.name,
        logo: restaurant?.logo,
        category: category?.title,
        hashtag: restaurant?.hashtag,
        address: restaurant?.address,
        workTime: restaurant?.worktime,
        contact: restaurant?.contact,
      },
      menu: menus,
    };

    return data;
  } catch (error) {
    logger.e(error);
    throw error;
  }
};

const getDistance = async (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  if (lat1 == lat2 && lon1 == lon2) return 0;

  const radLat1 = (Math.PI * lat1) / 180;
  const radLat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radTheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radLat1) * Math.sin(radLat2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);

  if (dist > 1) dist = 1;

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515 * 1.609344 * 1000;

  if (dist < 100) dist = Math.round(dist / 10) * 10;
  else dist = Math.round(dist / 100) * 100;

  return dist;
};

const getAroundRestaurants = async (
  longitude: number,
  latitude: number,
  zoom: number,
) => {
  try {
    const restaurants = await Restaurant.find({
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: zoom,
      },
    }).populate<{ category: ICategory }>("category");
    const results: AroundRestaurantDto[] = restaurants.map((restaurant) => {
      return {
        _id: restaurant._id as string,
        name: restaurant.name,
        longitude: restaurant.location.coordinates.at(1),
        latitude: restaurant.location.coordinates.at(0),
        isDietRestaurant: restaurant.category.isDiet,
      };
    });
    return results;
  } catch (error) {
    logger.e(error);
    throw error;
  }
};

const getPrescription = async (restaurantId: string) => {
  try {
    const categoryId = (await Restaurant.findById(restaurantId))?.category;
    const prescription = await Prescription.findOne({ category: categoryId });

    if (!prescription) {
      return null;
    }

    const data = {
      _id: prescription._id,
      category: (await Category.findById(categoryId))?.title,
      content: prescription.content,
    };

    return data;
  } catch (error) {
    logger.e(error);
    throw error;
  }
};

export default {
  getRestaurantSummary,
  getMenuDetail,
  getAroundRestaurants,
  getPrescription,
};
