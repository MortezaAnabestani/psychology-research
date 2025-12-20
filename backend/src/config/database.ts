import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://mashaaye_3pidehmash:%40Sepidehsan92@localhost:27017/mashaaye_psychology"
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};
