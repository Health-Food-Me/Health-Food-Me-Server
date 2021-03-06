import { Types } from "mongoose";

interface UserProfiile {
  _id: string;
  name: string;
  scrapRestaurants: (string | Types.ObjectId)[] | undefined;
}

export default UserProfiile;
