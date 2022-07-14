import { Types } from "mongoose";

interface Category {
  title: string;
  prescriptions: Types.ObjectId;
  isDiet: boolean;
}

export default Category;
