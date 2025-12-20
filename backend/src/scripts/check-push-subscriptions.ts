import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/User";

dotenv.config();

async function checkPushSubscriptions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ Connected to MongoDB");

    const users = await User.find({ role: "client" });

    console.log(`\n👥 Total clients: ${users.length}`);

    let subscribedCount = 0;
    let notSubscribedCount = 0;

    console.log("\n📊 Push Subscription Status:\n");

    users.forEach((user: any) => {
      const hasSubscription = user.preferences?.pushSubscription;

      if (hasSubscription) {
        subscribedCount++;
        console.log(`✅ ${user.name} (${user.email}) - Subscribed`);
        console.log(`   Endpoint: ${user.preferences.pushSubscription.endpoint?.substring(0, 50)}...`);
      } else {
        notSubscribedCount++;
        console.log(`❌ ${user.name} (${user.email}) - NOT Subscribed`);
      }
    });

    console.log(`\n📈 Summary:`);
    console.log(`   Subscribed: ${subscribedCount}`);
    console.log(`   Not Subscribed: ${notSubscribedCount}`);

    if (notSubscribedCount > 0) {
      console.log(`\n⚠️  ${notSubscribedCount} users need to enable push notifications in the app.`);
      console.log(`   They should:`);
      console.log(`   1. Open the app`);
      console.log(`   2. Allow notification permission when prompted`);
      console.log(`   3. The app will automatically subscribe them`);
    }

    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkPushSubscriptions();
