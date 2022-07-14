import { Types } from "mongoose";

interface Restaurant {
  location: {
    type: { type: string };
    coordinates: number[];
  };
  name: string;
  logo: string;
  category: Types.ObjectId;
  hashtag: string[];
  address: string;
  worktime: string[];
  contact: string;
  reviews: Types.ObjectId[];
  menus: string[];
}

export default Restaurant;
