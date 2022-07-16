import mongoose from "mongoose";

interface AutoCompleteSearchDto {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  isDietRestaurant: boolean;
}

export default AutoCompleteSearchDto;
