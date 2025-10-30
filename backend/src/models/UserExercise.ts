import mongoose, { Schema, Document } from "mongoose";

export enum ExerciseStatus {
  LOCKED = "locked",
  AVAILABLE = "available",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export interface IUserExercise extends Document {
  userId: string;
  groupAssignmentId: string;
  exerciseTemplateId: string;
  status: ExerciseStatus;
  startedAt?: Date;
  completedAt?: Date;
  lastAccessedAt?: Date;
  responses: Array<{
    fieldId: string;
    value: any;
    answeredAt: Date;
  }>;
  scheduledTime?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userExerciseSchema = new Schema<IUserExercise>(
  {
    userId: { type: String, required: true, ref: "User" },
    groupAssignmentId: { type: String, required: true, ref: "GroupAssignment" },
    exerciseTemplateId: { type: String, required: true, ref: "ExerciseTemplate" },
    status: { type: String, enum: Object.values(ExerciseStatus), default: ExerciseStatus.LOCKED },
    startedAt: Date,
    completedAt: Date,
    lastAccessedAt: Date,
    responses: [
      {
        fieldId: { type: String, required: true },
        value: Schema.Types.Mixed,
        answeredAt: { type: Date, default: Date.now },
      },
    ],
    scheduledTime: String,
  },
  { timestamps: true }
);

userExerciseSchema.index({ userId: 1, status: 1 });
userExerciseSchema.index({ groupAssignmentId: 1, exerciseTemplateId: 1 });

export const UserExercise = mongoose.model<IUserExercise>("UserExercise", userExerciseSchema);
