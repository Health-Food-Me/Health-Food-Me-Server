import { Types } from "mongoose";

interface RestaurantCard {
  _id: Types.ObjectId;
  name: string;
  category: string[];
  score: number;
  distance: number;
  longitude: number;
  latitude: number;
  logo: string;
}

export default RestaurantCard;
