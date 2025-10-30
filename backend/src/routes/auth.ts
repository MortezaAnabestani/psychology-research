import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { authenticate } from "../middleware/auth";
import { sendEmail } from "../config/email";

const router = express.Router();

// Register (Admin creates client accounts)
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "این ایمیل قبلاً ثبت شده است" });
    }

    const user = await User.create({
      email,
      password,
      name,
      role: role || "client",
    });

    // Send welcome email
    await sendEmail(
      email,
      "خوش آمدید به برنامه پژوهش",
      `
        <div dir="rtl" style="font-family: Tahoma, Arial;">
          <h2>سلام ${name} عزیز</h2>
          <p>حساب کاربری شما با موفقیت ایجاد شد.</p>
          <p>برای ورود از اطلاعات زیر استفاده کنید:</p>
          <p><strong>ایمیل:</strong> ${email}</p>
          <p>لطفاً پس از ورود، رمز عبور خود را تغییر دهید.</p>
          <a href="${process.env.CLIENT_URL}/login" style="background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">ورود به سایت</a>
        </div>
      `
    );

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "30d",
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "ایمیل یا رمز عبور اشتباه است" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "ایمیل یا رمز عبور اشتباه است" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "30d",
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get Current User
router.get("/me", authenticate, async (req: any, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Change Password
router.put("/change-password", authenticate, async (req: any, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }

    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "رمز عبور فعلی اشتباه است" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "رمز عبور با موفقیت تغییر یافت" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update Profile
router.put("/profile", authenticate, async (req: any, res) => {
  try {
    const { name, preferences } = req.body;

    const user = await User.findByIdAndUpdate(req.user.id, { name, preferences }, { new: true }).select(
      "-password"
    );

    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Subscribe to Push Notifications
router.post("/subscribe", authenticate, async (req: any, res) => {
  try {
    const subscription = req.body;

    // Store subscription in user preferences or separate collection
    await User.findByIdAndUpdate(req.user.id, {
      "preferences.pushSubscription": subscription,
    });

    res.json({ success: true, message: "اشتراک با موفقیت ثبت شد" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
