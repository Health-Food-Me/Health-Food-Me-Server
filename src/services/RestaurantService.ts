import { Types } from "mongoose";
import { logger } from "../config/winstonConfig";
import AroundRestaurantDto from "../controllers/dto/restaurant/AroundRestaurantDto";
import ICategory from "../interface/Category";
import MenuData from "../interface/menuData";
import Category from "../models/Category";
import Menu from "../models/Menu";
import Prescription from "../models/Prescription";
import Restaurant from "../models/Restaurant";
import Review from "../models/Review";
import User from "../models/User";
import AutoCompleteSearchDto from "../controllers/dto/restaurant/AutoCompleteSearchDto";
import RestaurantCard from "../interface/restaurantCard";

const getRestaurantSummary = async (restaurantId: string, userId: string) => {
  try {
    const restaurant = await Restaurant.findById(restaurantId).populate<{
      category: ICategory;
    }>("category");
    const user = await User.findById(userId);

    if (!restaurant || !user) {
      return null;
    }

    const reviewList = restaurant.reviews;
    const score = await getScore(reviewList);
    const scrapList = user?.scrapRestaurants;

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
    if ((error as Error).name === "CastError") {
      return null;
    }
    throw error;
  }
};

const getScore = async (reviewList: Types.ObjectId[]) => {
  if (reviewList == undefined) {
    return 0;
  }

  if (reviewList.length <= 0) {
    return 0;
  }

  let score = 0;

  const promises = reviewList.map(async (reviewId) => {
    const review = await Review.findById(reviewId);
    if (review != undefined) {
      score = score + review?.score;
    }
  });
  await Promise.all(promises);

  score = Number((score / reviewList.length).toFixed(1));

  return score;
};

const getMenuDetail = async (
  restaurantId: string,
  userId: string,
  latitude: number,
  longtitude: number,
) => {
  try {
    const restaurant = await Restaurant.findById(restaurantId).populate<{
      category: ICategory;
    }>("category");
    const user = await User.findById(userId);

    if (!restaurant || !user) {
      return null;
    }

    const restaurantLatitude = restaurant.location.coordinates.at(1);
    const restaurantLongtitude = restaurant.location.coordinates.at(0);
    const distance = await getDistance(
      latitude,
      longtitude,
      restaurantLatitude as number,
      restaurantLongtitude as number,
    );

    const menuIdList = restaurant.menus;
    const menuList = await getMenuList(menuIdList);

    const time = restaurant.worktime;
    let worktime;
    if (time != undefined) {
      worktime = [];
      const promise = restaurant.worktime.map(async (data) => {
        const timeData = data.split(" ");
        // [월, 화, 수, 목, 금, 토, 일] 순으로 영업시간 push
        worktime.push(timeData[1]);
      });
      await Promise.all(promise);
    } else {
      worktime = null;
    }

    const scrapList = user.scrapRestaurants;
    let isScrap = false;
    if (scrapList?.find((x) => x == restaurantId) !== undefined) isScrap = true;

    const data = {
      restaurant: {
        _id: restaurantId,
        distance: distance,
        name: restaurant?.name,
        logo: restaurant?.logo,
        category: restaurant?.category.title,
        hashtag: restaurant?.hashtag,
        address: restaurant?.address,
        workTime: worktime,
        contact: restaurant?.contact,
        isScrap: isScrap,
      },
      menu: menuList,
    };

    return data;
  } catch (error) {
    logger.e(error);
    if ((error as Error).name === "CastError") {
      return null;
    }
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

const getMenuList = async (menuIdList: Types.ObjectId[]) => {
  try {
    if (menuIdList == undefined) {
      return [];
    }

    if (menuIdList.length <= 0) {
      return [];
    }

    const menuList: MenuData[] = [];

    const promises = menuIdList.map(async (menuId) => {
      /*
      const menu = await Menu.findById(menuId).populate<{
        nutrient: INutrient;
      }>("nutrient");
      */
      const menu = await Menu.findById(menuId);

      const menuData: MenuData = {
        _id: menuId,
        name: menu?.name as string,
        image: menu?.image as string,
        kcal: menu?.kcal as number,
        per: menu?.per as number,
        //carbohydrate: menu?.nutrient.carbohydrate as number,
        //protein: menu?.nutrient.protein as number,
        //fat: menu?.nutrient.fat as number,
        price: menu?.price as number,
        isPick: menu?.isHelfoomePick as boolean,
      };

      menuList.push(menuData);
    });
    await Promise.all(promises);

    return menuList;
  } catch (error) {
    logger.e(error);
    if ((error as Error).name === "CastError") {
      return null;
    }
    throw error;
  }
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
        longitude: restaurant.location.coordinates.at(0),
        latitude: restaurant.location.coordinates.at(1),
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
    const restaurant = await Restaurant.findById(restaurantId);
    if (restaurant == undefined) {
      return null;
    }

    const category = await Category.findById(restaurant.category);
    if (category == undefined) {
      throw new Error("no category");
    }

    if (category.prescription == undefined) {
      const data = {
        category: category.title,
        content: null,
      };
      return data;
    }

    const prescription = await Prescription.findById(category.prescription);
    let content = prescription?.content;

    if (prescription == undefined) content = { recommend: [], tip: [] };

    const data = {
      category: category.title,
      content: content,
    };

    return data;
  } catch (error) {
    logger.e(error);
    if ((error as Error).name === "CastError") {
      return null;
    }
    throw error;
  }
};

const getRestaurantCardList = async (
  longtitude: number,
  latitude: number,
  keyword: string,
) => {
  try {
    const restaurantList = getAroundRestaurants(longtitude, latitude, 3000);

    const searchList = (await restaurantList).filter((restaurant) =>
      restaurant.name.includes(keyword),
    );

    const resultList: RestaurantCard[] = [];
    const promises = searchList.map(async (data) => {
      const restaurantId = data._id;
      const restaurant = await Restaurant.findById(restaurantId).populate<{
        category: ICategory;
      }>("category");

      if (restaurant != undefined) {
        const reviewList = restaurant.reviews;
        const score = await getScore(reviewList);
        const restaurantLatitude = restaurant.location.coordinates.at(
          0,
        ) as number;
        const restaurantLongtitude = restaurant.location.coordinates.at(
          1,
        ) as number;
        const distance = await getDistance(
          latitude,
          longtitude,
          restaurantLatitude,
          restaurantLongtitude,
        );

        const result: RestaurantCard = {
          _id: restaurant._id,
          name: restaurant.name,
          category: restaurant.category.title,
          score: score,
          distance: distance,
          logo: restaurant.logo,
        };

        resultList.push(result);
      }
    });
    await Promise.all(promises);

    return resultList;
  } catch (error) {
    logger.e(error);
    throw error;
  }
};

const getSearchAutoCompleteResult = async (query: string) => {
  const result = await Restaurant.find({
    name: { $regex: query },
  }).populate<{ category: ICategory }>("category");

  const dietCategories = await Category.find({ isDiet: true });

  const dietCategoryTitles = dietCategories.map((category) => {
    return category.title;
  });

  const data: AutoCompleteSearchDto[] = result.map((restaurant) => {
    return {
      _id: restaurant._id,
      name: restaurant.name,
      isDietRestaurant: dietCategoryTitles.includes(restaurant.category.title),
    };
  });

  return data;
};

export default {
  getRestaurantSummary,
  getMenuDetail,
  getAroundRestaurants,
  getPrescription,
  getRestaurantCardList,
  getScore,
  getSearchAutoCompleteResult,
};
