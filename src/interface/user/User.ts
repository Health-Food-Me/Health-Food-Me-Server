import { Types } from "mongoose";

interface User {
  _id: Types.ObjectId;
  name: string;
  social: string;
  socialId: string;
  email: string;
  scrapRestaurants: string[];
  refreshToken: string;
  userAgent: string;
  reviews: Types.ObjectId[];
}

export default User;
