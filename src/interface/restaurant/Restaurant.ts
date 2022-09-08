import { Types } from "mongoose";

interface Restaurant {
  _id: Types.ObjectId;
  name: string;
  location: {
    type: { type: string };
    coordinates: number[];
  };
  address: string;
  workTime: string[];
  contact: string;
  category: Types.ObjectId[];
  isDiet: boolean;
  logo: string;
  menuBoard: string[];
  menu: Types.ObjectId[];
  review: Types.ObjectId[];
}

export default Restaurant;
