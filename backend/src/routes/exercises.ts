import express from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import { UserExercise } from "../models/UserExercise";
import { ExerciseTemplate } from "../models/ExerciseTemplate";
import { ExerciseStatus } from "../types";

const router = express.Router();

router.use(authenticate);

// Get specific exercise
router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const exercise = await UserExercise.findOne({
      _id: req.params.id,
      userId: req.user!.id,
    })
      .populate("exerciseTemplateId")
      .populate("groupAssignmentId");

    if (!exercise) {
      return res.status(404).json({ message: "تمرین یافت نشد" });
    }

    if (exercise.status === ExerciseStatus.LOCKED) {
      return res.status(403).json({ message: "این تمرین هنوز قفل است" });
    }

    // Update last accessed time
    exercise.lastAccessedAt = new Date();

    // If first time accessing, mark as in progress
    if (!exercise.startedAt) {
      exercise.startedAt = new Date();
      exercise.status = ExerciseStatus.IN_PROGRESS;
    }

    await exercise.save();

    res.json({ success: true, exercise });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Save exercise response (partial or complete)
router.post("/:id/response", async (req: AuthRequest, res) => {
  try {
    const { responses, isComplete } = req.body;

    const exercise = await UserExercise.findOne({
      _id: req.params.id,
      userId: req.user!.id,
    });

    if (!exercise) {
      return res.status(404).json({ message: "تمرین یافت نشد" });
    }

    // Update or add responses
    responses.forEach((newResponse: any) => {
      const existingIndex = exercise.responses.findIndex((r) => r.fieldId === newResponse.fieldId);

      if (existingIndex >= 0) {
        exercise.responses[existingIndex] = {
          ...newResponse,
          answeredAt: new Date(),
        };
      } else {
        exercise.responses.push({
          ...newResponse,
          answeredAt: new Date(),
        });
      }
    });

    if (isComplete) {
      exercise.status = ExerciseStatus.COMPLETED;
      exercise.completedAt = new Date();

      // Unlock next exercise
      const template = await ExerciseTemplate.findById(exercise.exerciseTemplateId);
      if (template) {
        const nextTemplate = await ExerciseTemplate.findOne({
          groupType: template.groupType,
          order: template.order + 1,
        });

        if (nextTemplate) {
          await UserExercise.findOneAndUpdate(
            {
              userId: req.user!.id,
              groupAssignmentId: exercise.groupAssignmentId,
              exerciseTemplateId: nextTemplate._id,
            },
            { status: ExerciseStatus.AVAILABLE }
          );
        }
      }
    }

    await exercise.save();

    res.json({
      success: true,
      exercise,
      message: isComplete ? "تمرین با موفقیت تکمیل شد" : "پاسخ شما ذخیره شد",
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Mark exercise as started (when user clicks on it)
router.post("/:id/start", async (req: AuthRequest, res) => {
  try {
    const exercise = await UserExercise.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user!.id,
        status: ExerciseStatus.AVAILABLE,
      },
      {
        status: ExerciseStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
      { new: true }
    ).populate("exerciseTemplateId");

    if (!exercise) {
      return res.status(404).json({ message: "تمرین یافت نشد یا در دسترس نیست" });
    }

    res.json({ success: true, exercise });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get exercise template (for preview by admin)
router.get("/template/:id", async (req: AuthRequest, res) => {
  try {
    const template = await ExerciseTemplate.findById(req.params.id);
    res.json({ success: true, template });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
