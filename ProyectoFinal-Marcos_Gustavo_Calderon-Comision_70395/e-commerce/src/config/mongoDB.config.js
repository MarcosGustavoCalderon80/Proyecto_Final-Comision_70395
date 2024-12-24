import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {

    mongoose.connect("mongodb+srv://Admin:123@cluster70395.v55lt.mongodb.net/Ecommers")
    console.log("Mongo DB Connected");
  } catch (error) {
    console.log(error);
  }
}