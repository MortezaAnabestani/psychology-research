import express from "express";
import { AuthRequest } from "../middleware/auth";
import { User, UserRole } from "../models/User";
import { GroupAssignment, GroupType } from "../models/GroupAssignment";
import { ExerciseTemplate } from "../models/ExerciseTemplate";
import { UserExercise, ExerciseStatus } from "../models/UserExercise";
import { Notification } from "../models/Notification";
import { AdminSettings } from "../models/AdminSettings";
import ExcelJS from "exceljs";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, AlignmentType } from "docx";

const router = express.Router();

// ===== USER MANAGEMENT =====

// Get all clients
router.get("/clients", async (req: AuthRequest, res) => {
  try {
    const clients = await User.find({ role: UserRole.CLIENT }).select("-password").sort("-createdAt");

    // Fetch group assignments for each client
    const clientsWithGroups = await Promise.all(
      clients.map(async (client) => {
        const groupAssignments = await GroupAssignment.find({
          userId: client._id,
          isActive: true,
        }).select("groupType morningNotificationTime");

        return {
          ...client.toObject(),
          groupAssignments,
        };
      })
    );

    res.json({ success: true, clients: clientsWithGroups });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create new client
router.post("/clients", async (req: AuthRequest, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "این ایمیل قبلاً ثبت شده است" });
    }

    const client = await User.create({
      email,
      password,
      name,
      role: UserRole.CLIENT,
    });

    const clientObj = client.toObject();
    delete (clientObj as any).password;

    res.status(201).json({ success: true, client: clientObj });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update client
router.put("/clients/:id", async (req: AuthRequest, res) => {
  try {
    const { name, isActive, preferences } = req.body;

    const client = await User.findByIdAndUpdate(
      req.params.id,
      { name, isActive, preferences },
      { new: true }
    ).select("-password");

    res.json({ success: true, client });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Delete client
router.delete("/clients/:id", async (req: AuthRequest, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "کاربر با موفقیت حذف شد" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// ===== GROUP ASSIGNMENT =====

// Assign client to group
router.post("/assign-group", async (req: AuthRequest, res) => {
  try {
    const { userId, groupType, morningNotificationTime } = req.body;

    // Check if already assigned to this group
    const existing = await GroupAssignment.findOne({
      userId,
      groupType,
      isActive: true,
    });

    if (existing) {
      return res.status(400).json({ message: "کاربر قبلاً به این گروه اختصاص یافته است" });
    }

    const assignment = await GroupAssignment.create({
      userId,
      groupType,
      startDate: new Date(),
      morningNotificationTime,
    });

    // Create user exercises based on group templates
    const templates = await ExerciseTemplate.find({ groupType }).sort("order");

    for (let i = 0; i < templates.length; i++) {
      await UserExercise.create({
        userId,
        groupAssignmentId: assignment._id,
        exerciseTemplateId: templates[i]._id,
        status: i === 0 ? ExerciseStatus.AVAILABLE : ExerciseStatus.LOCKED,
      });
    }

    res.status(201).json({ success: true, assignment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get client's group assignments
router.get("/clients/:id/groups", async (req: AuthRequest, res) => {
  try {
    const assignments = await GroupAssignment.find({ userId: req.params.id });
    res.json({ success: true, assignments });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Sync exercises for a specific group assignment
router.post("/sync-exercises/:assignmentId", async (req: AuthRequest, res) => {
  try {
    const assignment = await GroupAssignment.findById(req.params.assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "گروه یافت نشد" });
    }

    // Get all templates for this group type
    const templates = await ExerciseTemplate.find({ groupType: assignment.groupType }).sort("order");

    // Get existing exercises for this assignment
    const existingExercises = await UserExercise.find({ groupAssignmentId: assignment._id });
    const existingTemplateIds = existingExercises.map((ex) => ex.exerciseTemplateId.toString());

    // Create missing exercises
    let created = 0;
    for (const template of templates) {
      const templateId = (template._id as any).toString();
      if (!existingTemplateIds.includes(templateId)) {
        await UserExercise.create({
          userId: assignment.userId,
          groupAssignmentId: assignment._id,
          exerciseTemplateId: template._id as any,
          status: created === 0 && existingExercises.length === 0 ? ExerciseStatus.AVAILABLE : ExerciseStatus.LOCKED,
        });
        created++;
      }
    }

    res.json({
      success: true,
      message: `${created} تمرین جدید ایجاد شد`,
      totalTemplates: templates.length,
      existingExercises: existingExercises.length,
      createdExercises: created,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// ===== EXERCISE TEMPLATE MANAGEMENT =====

// Get all exercise templates
router.get("/templates", async (req: AuthRequest, res) => {
  try {
    const { groupType } = req.query;
    const filter: any = {};
    if (groupType) filter.groupType = groupType;

    const templates = await ExerciseTemplate.find(filter).sort("order");
    res.json({ success: true, templates });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create custom exercise template
router.post("/templates", async (req: AuthRequest, res) => {
  try {
    const template = await ExerciseTemplate.create({
      ...req.body,
      isCustom: true,
      createdBy: req.user!.id,
    });

    res.status(201).json({ success: true, template });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update exercise template
router.put("/templates/:id", async (req: AuthRequest, res) => {
  try {
    const template = await ExerciseTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json({ success: true, template });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Delete exercise template
router.delete("/templates/:id", async (req: AuthRequest, res) => {
  try {
    const template = await ExerciseTemplate.findById(req.params.id);

    if (!template?.isCustom) {
      return res.status(400).json({ message: "نمی‌توانید تمرین‌های پیش‌فرض را حذف کنید" });
    }

    await ExerciseTemplate.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "تمرین با موفقیت حذف شد" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// ===== EXERCISE ACTIVATION =====

// Unlock specific exercise for user
router.post("/unlock-exercise", async (req: AuthRequest, res) => {
  try {
    const { userId, exerciseId } = req.body;

    const exercise = await UserExercise.findByIdAndUpdate(
      exerciseId,
      { status: ExerciseStatus.AVAILABLE },
      { new: true }
    );

    res.json({ success: true, exercise });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Lock specific exercise for user
router.post("/lock-exercise", async (req: AuthRequest, res) => {
  try {
    const { userId, exerciseId } = req.body;

    const exercise = await UserExercise.findByIdAndUpdate(
      exerciseId,
      { status: ExerciseStatus.LOCKED },
      { new: true }
    );

    res.json({ success: true, exercise });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// ===== STATISTICS & ANALYTICS =====

// Get dashboard statistics
router.get("/statistics", async (req: AuthRequest, res) => {
  try {
    const totalClients = await User.countDocuments({ role: UserRole.CLIENT, isActive: true });
    const totalExercises = await UserExercise.countDocuments();
    const completedExercises = await UserExercise.countDocuments({ status: ExerciseStatus.COMPLETED });
    const inProgressExercises = await UserExercise.countDocuments({ status: ExerciseStatus.IN_PROGRESS });

    const controlAssignments = await GroupAssignment.countDocuments({
      groupType: GroupType.CONTROL,
      isActive: true,
    });
    const interventionAssignments = await GroupAssignment.countDocuments({
      groupType: GroupType.INTERVENTION,
      isActive: true,
    });

    const recentActivity = await UserExercise.find()
      .sort("-updatedAt")
      .limit(10)
      .populate("userId", "name email")
      .populate("exerciseTemplateId", "title");

    res.json({
      success: true,
      statistics: {
        totalClients,
        totalExercises,
        completedExercises,
        inProgressExercises,
        completionRate: totalExercises > 0 ? ((completedExercises / totalExercises) * 100).toFixed(1) : "0",
        groupDistribution: {
          control: controlAssignments,
          intervention: interventionAssignments,
        },
        recentActivity,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get client progress
router.get("/clients/:id/progress", async (req: AuthRequest, res) => {
  try {
    const userId = req.params.id;

    const exercises = await UserExercise.find({ userId })
      .populate("exerciseTemplateId")
      .populate("groupAssignmentId")
      .sort("createdAt");

    const groupedByType = exercises.reduce((acc: any, ex: any) => {
      const groupType = ex.groupAssignmentId.groupType;
      if (!acc[groupType]) {
        acc[groupType] = {
          assignment: ex.groupAssignmentId,
          exercises: [],
        };
      }
      acc[groupType].exercises.push(ex);
      return acc;
    }, {});

    res.json({ success: true, progress: groupedByType });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// ===== DATA EXPORT =====

// Get all responses with details
router.get("/responses", async (req: AuthRequest, res) => {
  try {
    const { clientId, groupType, templateId } = req.query;

    // Build filter
    const filter: any = {};
    if (clientId) filter.userId = clientId;

    const exercises = await UserExercise.find(filter)
      .populate("userId", "name email")
      .populate("exerciseTemplateId")
      .populate("groupAssignmentId")
      .sort("-completedAt");

    // Filter by groupType if provided
    let filteredExercises = exercises;
    if (groupType) {
      filteredExercises = exercises.filter((ex: any) => ex.groupAssignmentId?.groupType === groupType);
    }
    if (templateId) {
      filteredExercises = exercises.filter((ex: any) => ex.exerciseTemplateId?._id.toString() === templateId);
    }

    // Format responses
    const formattedResponses = filteredExercises
      .filter((ex: any) => ex.responses && ex.responses.length > 0)
      .map((ex: any) => ({
        _id: ex._id,
        client: {
          _id: ex.userId._id,
          name: ex.userId.name,
          email: ex.userId.email,
        },
        group: {
          type: ex.groupAssignmentId?.groupType || "N/A",
          name:
            ex.groupAssignmentId?.groupType === "control" ? "گروه کنترل - خودپایشی" : "گروه مداخله - تجویز هیجان مثبت",
        },
        exercise: {
          _id: ex.exerciseTemplateId?._id,
          title: ex.exerciseTemplateId?.title || "N/A",
          order: ex.exerciseTemplateId?.order,
        },
        status: ex.status,
        startedAt: ex.startedAt,
        completedAt: ex.completedAt,
        responses: ex.responses.map((r: any) => {
          const field = ex.exerciseTemplateId?.fields?.find((f: any) => f.id === r.fieldId);
          return {
            fieldId: r.fieldId,
            fieldLabel: field?.label || r.fieldId,
            fieldType: field?.type || "unknown",
            value: r.value,
            answeredAt: r.answeredAt,
          };
        }),
      }));

    res.json({
      success: true,
      count: formattedResponses.length,
      responses: formattedResponses,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Export all data to Excel
router.get("/export", async (req: AuthRequest, res) => {
  try {
    const workbook = new ExcelJS.Workbook();

    // Clients Sheet
    const clientsSheet = workbook.addWorksheet("مراجعان");
    clientsSheet.columns = [
      { header: "نام", key: "name", width: 20 },
      { header: "ایمیل", key: "email", width: 30 },
      { header: "تاریخ ثبت‌نام", key: "createdAt", width: 20 },
      { header: "وضعیت", key: "isActive", width: 15 },
    ];

    const clients = await User.find({ role: UserRole.CLIENT });
    clients.forEach((client) => {
      clientsSheet.addRow({
        name: client.name,
        email: client.email,
        createdAt: client.createdAt.toLocaleDateString("fa-IR"),
        isActive: client.isActive ? "فعال" : "غیرفعال",
      });
    });

    // Exercises Data Sheet
    const exercisesSheet = workbook.addWorksheet("پاسخ‌های تمرین‌ها");
    exercisesSheet.columns = [
      { header: "نام مراجع", key: "clientName", width: 20 },
      { header: "ایمیل", key: "email", width: 30 },
      { header: "نوع گروه", key: "groupType", width: 15 },
      { header: "عنوان تمرین", key: "exerciseTitle", width: 30 },
      { header: "شماره تمرین", key: "order", width: 15 },
      { header: "وضعیت", key: "status", width: 15 },
      { header: "تاریخ شروع", key: "startedAt", width: 20 },
      { header: "تاریخ اتمام", key: "completedAt", width: 20 },
      { header: "پاسخ‌ها", key: "responses", width: 50 },
    ];

    const exercises = await UserExercise.find()
      .populate("userId")
      .populate("exerciseTemplateId")
      .populate("groupAssignmentId");

    exercises.forEach((ex: any) => {
      exercisesSheet.addRow({
        clientName: ex.userId.name,
        email: ex.userId.email,
        groupType: ex.groupAssignmentId.groupType === "control" ? "کنترل" : "مداخله",
        exerciseTitle: ex.exerciseTemplateId.title,
        order: ex.exerciseTemplateId.order,
        status:
          ex.status === "completed" ? "تکمیل‌شده" : ex.status === "in_progress" ? "در حال انجام" : "قفل",
        startedAt: ex.startedAt ? ex.startedAt.toLocaleDateString("fa-IR") : "",
        completedAt: ex.completedAt ? ex.completedAt.toLocaleDateString("fa-IR") : "",
        responses: JSON.stringify(ex.responses, null, 2),
      });
    });

    // Detailed Responses Sheet
    const responsesSheet = workbook.addWorksheet("پاسخ‌های تفصیلی");
    responsesSheet.columns = [
      { header: "نام مراجع", key: "clientName", width: 20 },
      { header: "ایمیل", key: "email", width: 30 },
      { header: "گروه", key: "groupType", width: 15 },
      { header: "تمرین", key: "exerciseTitle", width: 30 },
      { header: "شماره تمرین", key: "order", width: 15 },
      { header: "سوال", key: "question", width: 40 },
      { header: "نوع سوال", key: "questionType", width: 15 },
      { header: "پاسخ", key: "answer", width: 50 },
      { header: "تاریخ پاسخ", key: "answeredAt", width: 20 },
    ];

    exercises.forEach((ex: any) => {
      if (ex.responses && ex.responses.length > 0) {
        ex.responses.forEach((response: any) => {
          const field = ex.exerciseTemplateId.fields?.find((f: any) => f.id === response.fieldId);
          responsesSheet.addRow({
            clientName: ex.userId.name,
            email: ex.userId.email,
            groupType: ex.groupAssignmentId.groupType === "control" ? "کنترل" : "مداخله",
            exerciseTitle: ex.exerciseTemplateId.title,
            order: ex.exerciseTemplateId.order,
            question: field?.label || response.fieldId,
            questionType: field?.type || "unknown",
            answer: response.value,
            answeredAt: response.answeredAt ? new Date(response.answeredAt).toLocaleString("fa-IR") : "",
          });
        });
      }
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=research-data.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Export all data to Word
router.get("/export-word", async (req: AuthRequest, res) => {
  try {
    const exercises = await UserExercise.find()
      .populate("userId")
      .populate("exerciseTemplateId")
      .populate("groupAssignmentId")
      .sort("userId");

    const sections: any[] = [];

    // Title
    sections.push(
      new Paragraph({
        text: "گزارش جامع پژوهش روانشناسی",
        heading: "Heading1",
        alignment: AlignmentType.RIGHT,
        spacing: { after: 400 },
      })
    );

    sections.push(
      new Paragraph({
        text: `تاریخ تهیه گزارش: ${new Date().toLocaleDateString("fa-IR")}`,
        alignment: AlignmentType.RIGHT,
        spacing: { after: 600 },
      })
    );

    // Group by client
    const clientsMap = new Map();
    exercises.forEach((ex: any) => {
      const clientId = ex.userId._id.toString();
      if (!clientsMap.has(clientId)) {
        clientsMap.set(clientId, {
          info: ex.userId,
          exercises: [],
        });
      }
      clientsMap.get(clientId).exercises.push(ex);
    });

    // Create content for each client
    for (const [clientId, data] of clientsMap) {
      // Client header
      sections.push(
        new Paragraph({
          text: `مراجع: ${data.info.name}`,
          heading: "Heading2",
          alignment: AlignmentType.RIGHT,
          spacing: { before: 400, after: 200 },
        })
      );

      sections.push(
        new Paragraph({
          text: `ایمیل: ${data.info.email}`,
          alignment: AlignmentType.RIGHT,
          spacing: { after: 300 },
        })
      );

      // Exercises for this client
      data.exercises.forEach((ex: any) => {
        if (ex.responses && ex.responses.length > 0) {
          sections.push(
            new Paragraph({
              text: `${ex.groupAssignmentId?.groupType === "control" ? "گروه کنترل" : "گروه مداخله"} - ${
                ex.exerciseTemplateId.title
              }`,
              heading: "Heading3",
              alignment: AlignmentType.RIGHT,
              spacing: { before: 300, after: 200 },
            })
          );

          if (ex.completedAt) {
            sections.push(
              new Paragraph({
                text: `تاریخ تکمیل: ${new Date(ex.completedAt).toLocaleDateString("fa-IR")}`,
                alignment: AlignmentType.RIGHT,
                spacing: { after: 200 },
              })
            );
          }

          // Responses
          ex.responses.forEach((response: any, idx: number) => {
            const field = ex.exerciseTemplateId.fields?.find((f: any) => f.id === response.fieldId);

            sections.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${idx + 1}. ${field?.label || response.fieldId}`,
                    bold: true,
                  }),
                ],
                alignment: AlignmentType.RIGHT,
                spacing: { before: 150, after: 100 },
              })
            );

            sections.push(
              new Paragraph({
                text: response.value || "(بدون پاسخ)",
                alignment: AlignmentType.RIGHT,
                spacing: { after: 200 },
                indent: { right: 300 },
              })
            );
          });

          sections.push(
            new Paragraph({
              text: "────────────────────────────",
              alignment: AlignmentType.CENTER,
              spacing: { before: 200, after: 200 },
            })
          );
        }
      });
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: sections,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", "attachment; filename=research-data.docx");
    res.send(buffer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// ===== SETTINGS =====

// Debug endpoint to check templates (temporary)
router.get("/debug/templates", async (req: AuthRequest, res) => {
  try {
    const controlTemplates = await ExerciseTemplate.find({ groupType: GroupType.CONTROL });
    const interventionTemplates = await ExerciseTemplate.find({ groupType: GroupType.INTERVENTION });
    const totalUsers = await User.countDocuments({ role: UserRole.CLIENT });
    const totalAssignments = await GroupAssignment.countDocuments();
    const totalUserExercises = await UserExercise.countDocuments();

    res.json({
      success: true,
      data: {
        templates: {
          control: controlTemplates.length,
          intervention: interventionTemplates.length,
          total: controlTemplates.length + interventionTemplates.length,
        },
        users: totalUsers,
        assignments: totalAssignments,
        userExercises: totalUserExercises,
        controlTemplates: controlTemplates.map((t) => ({ id: t._id, title: t.title, order: t.order })),
        interventionTemplates: interventionTemplates.map((t) => ({ id: t._id, title: t.title, order: t.order })),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get admin settings
router.get("/settings", async (req: AuthRequest, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = await AdminSettings.create({
        allowHistoryAccess: false,
        randomNotificationRanges: {
          morning: { start: "10:00", end: "12:00" },
          afternoon: { start: "14:00", end: "16:00" },
          evening: { start: "18:00", end: "20:00" },
        },
        updatedBy: req.user!.id,
      });
    }
    res.json({ success: true, settings });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update admin settings
router.put("/settings", async (req: AuthRequest, res) => {
  try {
    const settings = await AdminSettings.findOneAndUpdate(
      {},
      { ...req.body, updatedBy: req.user!.id },
      { new: true, upsert: true }
    );

    res.json({ success: true, settings });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
