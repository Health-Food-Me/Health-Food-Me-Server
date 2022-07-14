import { Types } from "mongoose";

interface MenuData {
  _id: Types.ObjectId;
  name: string;
  image: string;
  kcal: number;
  carbohydrate: number;
  protein: number;
  fat: number;
  price: number;
  isPick: boolean;
}

export default MenuData;
