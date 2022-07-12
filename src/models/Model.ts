import mongoose from "mongoose";

export type MongoEntity<T> = T & mongoose.Document;
