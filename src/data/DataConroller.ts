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
    const rows = data.split("\n");

    for (const rowIndex in rows) {
      const row = rows[rowIndex].split("\t");
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
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const addResstaurantData = async (req: Request, res: Response) => {
  try {
    const dataList = await getData("sampledata.csv");
    const result: any[] = [];

    if (dataList != undefined) {
      const promises = dataList.map(async (data) => {
        console.log(data.worktime);
        // const worktime = data.split(",");

        /*
        const restaurant = new Restaurant({
          location: [data.latitude, data.longtitude],
          name: data.name,
          logo: "",
          category: "62d023eaf06f30da37ce0629",
          hashtag: [],
          address: data.address,
          worktime: worktime,
          contact: data.phone,
          reviews: [],
          menus: [],
        });

        await restaurant.save();
        */
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

export default {
  addResstaurantData,
};
