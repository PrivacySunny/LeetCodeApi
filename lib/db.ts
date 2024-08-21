import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already Connected ! ");
    return;
  }

  if (connectionState === 2) {
    console.log("Connecting...!");
    return;
  }

  try {
    mongoose.connect(MONGODB_URI!, {
      dbName: "LeetCODEApi",
      bufferCommands: true,
    });
    console.log("Connected!");
  } catch (err: any) {
    console.log("Error ! Occured", err);
    throw new Error(err);
  }
};

export default connect;
