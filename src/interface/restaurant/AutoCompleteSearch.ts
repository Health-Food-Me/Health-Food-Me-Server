import mongoose from "mongoose";

interface AutoCompleteSearch {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  isDiet: boolean;
  isCategory: boolean;
  distance: number;
  longitude: number;
  latitude: number;
}

export default AutoCompleteSearch;
