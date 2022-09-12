import { Types } from "mongoose";

interface MenuData {
  _id: Types.ObjectId;
  name: string;
  image: string;
  kcal: number;
  per: number;
  price: number;
  isPick: boolean;
}

export default MenuData;
