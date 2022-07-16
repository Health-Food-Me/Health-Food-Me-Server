import { Request, Response } from "express";
import BaseResponse from "../modules/BaseResponse";
import message from "../modules/responseMessage";
import statusCode from "../modules/statusCode";
import pathL = require("path");
import fsL = require("fs");
import Restaurant from "../models/Restaurant";
import Prescription from "../models/Prescription";
import Category from "../models/Category";

const getData = async (file_name: string) => {
  try {
    const path = pathL;
    const fs = fsL;

    const filePath = path.join(__dirname, file_name);
    const result = [];

    let data = fs.readFileSync(filePath, "utf-8");
    console.log(data);
    const rows = data.split("\n");
    //console.log(rows);

    for (const rowIndex in rows) {
      const row = rows[rowIndex].split(",");
      //console.log(row);
      if (rowIndex === "0") {
        var columns = row;
      } else {
        data = {}; // 빈 객체를 생성하고 여기에 데이터를 추가한다.
        for (var columnIndex in columns) {
          var column = columns[columnIndex];
          data[column] = row[columnIndex];
        }
        result.push(data);
      }
    }
    //console.log(result);

    return result;
  } catch (error) {
    console.log(error);
  }
};

const addResstaurantData = async (req: Request, res: Response) => {
  try {
    const dataList = await getData("restaurant_data.csv");
    const result: any[] = [];

    //console.log(dataList);


    if (dataList != undefined) {
      const promises = dataList.map(async (data) => {
        const worktime = data.time.split("/");

        const category = await Category.findOne({ title: data.category });

        const restaurant = new Restaurant({
          location: {
            type: "Point",
            coordinates: [Number(data.longtitude), Number(data.latitude)],
          },
          name: data.name,
          logo: `logo${data.name}`,
          category: category?._id,
          hashtag: [],
          address: data.address,
          worktime: worktime,
          contact: data.phone,
          reviews: [],
          menus: [],
        });

        await restaurant.save();
      });
      await Promise.all(promises);
    }


    return res
      .status(statusCode.OK)
      .send(BaseResponse.success(statusCode.OK, message.CREATE_FEED_SUCCESS));
  } catch (error) {
    console.log(error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        BaseResponse.success(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR,
        ),
      );
  }
};

const addCategoryData = async (req: Request, res: Response) => {
  try {
    const dataList = await getData("category_data.csv");

    if (dataList != undefined) {
      const promises = dataList.map(async (data) => {
        const prescription = new Prescription({
          category: "62d023eaf06f30da37ce0629",
          content: {
            recommend: data.recommend.split("/"),
            tip: data.tip.split("/"),
          },
        });

        const newPrescription = await prescription.save();

        const category = new Category({
          title: data.category,
          prescription: newPrescription._id,
          isDiet: data.isDiet,
        });

        const newCategory = await category.save();

        await Prescription.findByIdAndUpdate(newPrescription._id, {
          $set: { category: newCategory._id },
        });
      });
      await Promise.all(promises);
    }

    return res
      .status(statusCode.OK)
      .send(BaseResponse.success(statusCode.OK, message.CREATE_FEED_SUCCESS, dataList));
  } catch (error) {
    console.log(error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        BaseResponse.success(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR,
        ),
      );
  }
};

export default {
  addResstaurantData,
  addCategoryData,
};
