import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost/merndb1");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Errror connecting to MongoDB");
    console.log(error);
  }
};

export default connectDb;