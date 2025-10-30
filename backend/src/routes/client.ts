import express from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import { UserExercise } from "../models/UserExercise";
import { GroupAssignment } from "../models/GroupAssignment";
import { ExerciseTemplate } from "../models/ExerciseTemplate";
import { Notification } from "../models/Notification";
import { User } from "../models/User";
import { ExerciseStatus } from "../types";

const router = express.Router();

router.use(authenticate);

// Get client dashboard data
router.get("/dashboard", async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    // Get active group assignments
    const assignments = await GroupAssignment.find({
      userId,
      isActive: true,
    });

    // Get exercises for each group
    const exercisesByGroup: any = {};

    for (const assignment of assignments) {
      const exercises = await UserExercise.find({
        userId,
        groupAssignmentId: assignment._id,
      })
        .populate("exerciseTemplateId")
        .sort("createdAt");

      exercisesByGroup[assignment.groupType] = {
        assignment,
        exercises,
      };
    }

    // Get pending notifications
    const pendingNotifications = await Notification.find({
      userId,
      sentAt: null,
      scheduledFor: { $gte: new Date() },
    }).limit(5);

    // Get unread notifications
    const unreadNotifications = await Notification.find({
      userId,
      readAt: null,
      sentAt: { $ne: null },
    })
      .sort("-sentAt")
      .limit(10);

    // Statistics
    const totalExercises = await UserExercise.countDocuments({ userId });
    const completedExercises = await UserExercise.countDocuments({
      userId,
      status: ExerciseStatus.COMPLETED,
    });

    res.json({
      success: true,
      data: {
        exercisesByGroup,
        pendingNotifications,
        unreadNotifications,
        statistics: {
          total: totalExercises,
          completed: completedExercises,
          completionRate: totalExercises > 0 ? ((completedExercises / totalExercises) * 100).toFixed(1) : 0,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get available exercises
router.get("/exercises/available", async (req: AuthRequest, res) => {
  try {
    const exercises = await UserExercise.find({
      userId: req.user!.id,
      status: { $in: [ExerciseStatus.AVAILABLE, ExerciseStatus.IN_PROGRESS] },
    })
      .populate("exerciseTemplateId")
      .populate("groupAssignmentId")
      .sort("createdAt");

    res.json({ success: true, exercises });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get exercise history (if allowed)
router.get("/exercises/history", async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user!.id);

    if (!user?.preferences?.allowHistoryAccess) {
      return res.status(403).json({ message: "دسترسی به تاریخچه مجاز نیست" });
    }

    const exercises = await UserExercise.find({
      userId: req.user!.id,
      status: ExerciseStatus.COMPLETED,
    })
      .populate("exerciseTemplateId")
      .populate("groupAssignmentId")
      .sort("-completedAt");

    res.json({ success: true, exercises });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Set morning notification time for group
router.post("/set-notification-time", async (req: AuthRequest, res) => {
  try {
    const { groupAssignmentId, time } = req.body;

    const assignment = await GroupAssignment.findOneAndUpdate(
      {
        _id: groupAssignmentId,
        userId: req.user!.id,
      },
      { morningNotificationTime: time },
      { new: true }
    );

    if (!assignment) {
      return res.status(404).json({ message: "گروه یافت نشد" });
    }

    res.json({ success: true, assignment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
