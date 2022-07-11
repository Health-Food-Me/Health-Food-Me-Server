import mongoose from "mongoose";

export type DataModel<T> = T & mongoose.Document;
