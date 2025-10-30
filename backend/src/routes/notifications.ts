import express from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import { Notification } from "../models/Notification";

const router = express.Router();

router.use(authenticate);

// Get user notifications
router.get("/", async (req: AuthRequest, res) => {
  try {
    const { unreadOnly } = req.query;

    const filter: any = { userId: req.user!.id, sentAt: { $ne: null } };
    if (unreadOnly === "true") {
      filter.readAt = null;
    }

    const notifications = await Notification.find(filter).sort("-scheduledFor").limit(50);

    res.json({ success: true, notifications });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as read
router.put("/:id/read", async (req: AuthRequest, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user!.id,
      },
      { readAt: new Date() },
      { new: true }
    );

    res.json({ success: true, notification });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as clicked
router.put("/:id/clicked", async (req: AuthRequest, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user!.id,
      },
      { clicked: true, readAt: new Date() },
      { new: true }
    );

    res.json({ success: true, notification });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
