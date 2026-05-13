import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log("Connected to Database👍");
  } catch (error) {
    console.log(error || "Error connecting to database");
  }
};

export default connectDb;
