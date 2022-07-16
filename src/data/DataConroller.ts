import { Request, Response } from "express";
import BaseResponse from "../modules/BaseResponse";
import message from "../modules/responseMessage";
import statusCode from "../modules/statusCode";
import pathL = require("path");
import fsL = require("fs");
import Restaurant from "../models/Restaurant";

const getData = async (file_name: string) => {
  try {
    const path = pathL;
    const fs = fsL;

    const filePath = path.join(__dirname, file_name);
    const result = [];

    let data = fs.readFileSync(filePath, "utf-8");
    const rows = data.split("\n").join(",").split("\r");
    console.log(rows);

    for (const rowIndex in rows) {
      const row = rows[rowIndex].split(":");
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

    return result;
  } catch (error) {
    console.log(error);
  }
};

const addResstaurantData = async (req: Request, res: Response) => {
  try {
    const dataList = await getData("sampledata.csv");
    const result: any[] = [];

    let i = 0;

    if (dataList != undefined) {
      const promises = dataList.map(async (data) => {
        const worktime = data.worktime.split(",");
        console.log(i);

        const restaurant = new Restaurant({
          location: {
            type: "Point",
            coordinates: [Number(data.lontitude), Number(data.latitude)],
          },
          name: data.name,
          logo: `logo${data.name}`,
          category: "62d023eaf06f30da37ce0629",
          hashtag: [],
          address: data.address,
          worktime: worktime,
          contact: data.phone,
          reviews: [],
          menus: [],
        });

        await restaurant.save();

        i = i + 1;
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

    //console.log(dataList);

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
