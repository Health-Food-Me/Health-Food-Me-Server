import { Types } from "mongoose";
import { logger } from "../config/winstonConfig";
import AroundRestaurant from "../interface/restaurant/AroundRestaurant";
import AutoCompleteSearch from "../interface/restaurant/AutoCompleteSearch";
import ICategory from "../interface/restaurant/Category";
import MenuData from "../interface/restaurant/MenuData";
import RestaurantCard from "../interface/restaurant/RestaurantCard";
import Category from "../models/Category";
import Menu from "../models/Menu";
import Prescription from "../models/Prescription";
import Restaurant from "../models/Restaurant";
import Review from "../models/Review";
import User from "../models/User";
import exceptionMessage from "../modules/exceptionMessage";

const getRestaurantSummary = async (restaurantId: string, userId: string) => {
  try {
    const restaurant = await Restaurant.findById(restaurantId).populate<{
      category: ICategory[];
    }>("category");

    if (!restaurant) return null;

    const categories: string[] = [];
    const categoryList = restaurant.category;
    categoryList.map(async (category) => {
      categories.push(category.title);
    });

    const reviewList = restaurant.review;
    const score = await getScore(reviewList);

    let isScrap = false;
    if (userId !== "browsing") {
      const user = await User.findById(userId);

      if (!user) return null;
      const scrapList = user.scrapRestaurants;

      if (scrapList?.find((x) => x == restaurantId) !== undefined) {
        isScrap = true;
      }
    }

    const data = {
      _id: restaurantId,
      name: restaurant.name,
      longitude: restaurant.location.coordinates.at(0),
      latitude: restaurant.location.coordinates.at(1),
      logo: restaurant.logo,
      category: categories,
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

    if (!restaurant) return null;

    const restaurantLatitude = restaurant.location.coordinates.at(1);
    const restaurantLongtitude = restaurant.location.coordinates.at(0);
    const distance = await getDistance(
      latitude,
      longtitude,
      restaurantLatitude as number,
      restaurantLongtitude as number,
    );

    const menuIdList = restaurant.menu;
    const menuList = await getMenuList(menuIdList);

    const time = restaurant.workTime;
    let worktime;
    if (time != undefined) {
      worktime = [];
      const promise = restaurant.workTime.map(async (data) => {
        const timeData = data.split(" ");
        // [월, 화, 수, 목, 금, 토, 일] 순으로 영업시간 push
        worktime.push(timeData[1]);
      });
      await Promise.all(promise);
    } else {
      worktime = null;
    }

    let isScrap = false;
    if (userId !== "browsing") {
      const user = await User.findById(userId);

      if (!user) return null;

      let scrapList = user.scrapRestaurants;
      if (!scrapList) scrapList = [];

      if (scrapList.find((x) => x == restaurantId) !== undefined) {
        isScrap = true;
      }
    }

    const reviewList = restaurant.review;
    const score = await getScore(reviewList);

    const data = {
      restaurant: {
        _id: restaurantId,
        distance: distance,
        name: restaurant?.name,
        logo: restaurant?.logo,
        category: restaurant?.category.title,
        hashtag: restaurant.hashtag,
        address: restaurant?.address,
        workTime: worktime,
        contact: restaurant?.contact,
        isScrap: isScrap,
        score: score,
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
  category?: string,
) => {
  try {
    const locationQuery = {
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: zoom,
        },
      },
    };

    let noCategory = false;
    const categoryQuery: any[] = [];

    if (category) {
      const categories = category.split(",");

      const promises = categories.map(async (category) => {
        const result = await Category.findOne({ title: { $eq: category } });

        if (!result) {
          noCategory = true;
          return null;
        }

        categoryQuery.push({ category: { $in: result._id } });
      });
      await Promise.all(promises);
    }

    if (noCategory) return exceptionMessage.NO_CATEGORY;

    const restaurants = await Restaurant.find({
      $and: [locationQuery, { $or: categoryQuery }],
    }).populate<{ category: ICategory }>("category");

    const results: AroundRestaurant[] = restaurants.map((restaurant) => {
      return {
        _id: restaurant._id as string,
        name: restaurant.name,
        longitude: restaurant.location.coordinates.at(0),
        latitude: restaurant.location.coordinates.at(1),
        isDietRestaurant: restaurant.isDiet,
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
  longitude: number,
  latitude: number,
  keyword: string,
) => {
  try {
    const foodList = await (
      await Menu.find({
        name: { $regex: `.*${keyword}.*` },
      })
    ).map((x) => x._id);

    const searchList = await Restaurant.find({
      $or: [
        {
          name: { $regex: `.*${keyword}.*` },
        },
        { menus: { $in: foodList } },
      ],
    }).populate<{ category: ICategory }>("category");

    const result: RestaurantCard[] = [];

    const promises = searchList.map(async (restaurant) => {
      const score = await getScore(restaurant.review);
      const distance = await getDistance(
        latitude,
        longitude,
        restaurant.location.coordinates.at(1) as number,
        restaurant.location.coordinates.at(0) as number,
      );

      const data: RestaurantCard = {
        _id: restaurant._id,
        name: restaurant.name,
        category: restaurant.category.title,
        score: score,
        distance: distance,
        longitude: restaurant.location.coordinates.at(0) as number,
        latitude: restaurant.location.coordinates.at(1) as number,
        logo: restaurant.logo,
      };

      result.push(data);
    });
    await Promise.all(promises);

    result.sort(function (a, b) {
      return a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0;
    });

    return result;
  } catch (error) {
    logger.e(error);
    throw error;
  }
};

const getSearchAutoCompleteResult = async (
  longitude: number,
  latitude: number,
  query: string,
) => {
  const categoryList = await Category.find({
    title: { $regex: query },
  });

  const result: AutoCompleteSearch[] = [];

  let promises = categoryList.map(async (category) => {
    const data: AutoCompleteSearch = {
      _id: category._id,
      name: category.title,
      isDiet: category.isDiet,
      isCategory: true,
      distance: 0,
      longitude: 0,
      latitude: 0,
    };

    result.push(data);
  });
  await Promise.all(promises);

  const restaurantList = await Restaurant.find({
    name: { $regex: query },
  }).populate<{ category: ICategory }>("category");

  promises = restaurantList.map(async (restaurant) => {
    const distance = await getDistance(
      latitude,
      longitude,
      restaurant.location.coordinates.at(1) as number,
      restaurant.location.coordinates.at(0) as number,
    );

    const data: AutoCompleteSearch = {
      _id: restaurant._id,
      name: restaurant.name,
      isDiet: restaurant.isDiet,
      isCategory: false,
      distance: distance,
      longitude: restaurant.location.coordinates.at(0) as number,
      latitude: restaurant.location.coordinates.at(1) as number,
    };

    result.push(data);
  });
  await Promise.all(promises);

  result.sort(function (a, b) {
    return a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0;
  });

  return result;
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
