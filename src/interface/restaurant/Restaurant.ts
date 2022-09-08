import { Types } from "mongoose";

interface Restaurant {
  _id: Types.ObjectId;
  location: {
    type: { type: string };
    coordinates: number[];
  };
  name: string;
  logo: string;
  category: Types.ObjectId;
  hashtag: string[];
  address: string;
  workTime: string[];
  contact: string;
  reviews: Types.ObjectId[];
  menus: Types.ObjectId[];
}

export default Restaurant;
