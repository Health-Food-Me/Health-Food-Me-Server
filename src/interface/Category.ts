import { Types } from "mongoose";

interface Category {
  title: string;
  prescription: Types.ObjectId;
  isDiet: boolean;
}

export default Category;
