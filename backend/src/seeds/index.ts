import { connectDatabase } from "../config/database";
import { seedExercises } from "./exercises";
import { User } from "../models/User";
import { UserRole } from "../types";

export const runSeeds = async () => {
  try {
    await connectDatabase();

    // Create default admin if doesn't exist
    const adminExists = await User.findOne({ role: UserRole.ADMIN });
    if (!adminExists) {
      await User.create({
        email: "admin@example.com",
        password: "admin123",
        name: "مدیر سیستم",
        role: UserRole.ADMIN,
      });
      console.log("✅ Default admin created (email: admin@example.com, password: admin123)");
    }

    // Seed exercises
    await seedExercises();

    console.log("✅ All seeds completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runSeeds();
}
