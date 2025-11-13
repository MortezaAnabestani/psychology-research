import mongoose, { Schema, Document } from "mongoose";

export enum NotificationType {
  MORNING = "morning",
  RANDOM = "random",
  SCHEDULED = "scheduled",
  REMINDER = "reminder",
}

export enum FieldType {
  TEXT = "text",
  TEXTAREA = "textarea",
  RADIO = "radio",
  CHECKBOX = "checkbox",
  SCALE = "scale",
  TIME = "time",
  DATE = "date",
}

export interface IExerciseTemplate extends Document {
  title: string;
  groupType: string;
  order: number;
  description: string;
  instructions: string;
  notifications: Array<{
    type: NotificationType;
    count: number;
    scheduleType: "fixed" | "random" | "user_time";
    times?: string[];
    timeRanges?: Array<{ start: string; end: string }>;
    messages: string[];
  }>;
  fields: Array<{
    id: string;
    type: FieldType;
    label: string;
    desc: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
    min?: number;
    max?: number;
    order: number;
  }>;
  completionMessage?: string;
  isCustom: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const exerciseTemplateSchema = new Schema<IExerciseTemplate>(
  {
    title: { type: String, required: true },
    groupType: { type: String, required: true },
    order: { type: Number, required: true },
    description: { type: String, required: true },
    instructions: { type: String, required: true },
    notifications: [
      {
        type: { type: String, enum: Object.values(NotificationType), required: true },
        count: { type: Number, required: true },
        scheduleType: { type: String, enum: ["fixed", "random", "user_time"], required: true },
        times: [String],
        timeRanges: [{ start: String, end: String }],
        messages: [String],
      },
    ],
    fields: [
      {
        id: { type: String, required: true },
        type: { type: String, enum: Object.values(FieldType), required: true },
        label: { type: String, required: true },
        desc: String,
        placeholder: String,
        required: { type: Boolean, default: false },
        options: [String],
        min: Number,
        max: Number,
        order: { type: Number, required: true },
      },
    ],
    completionMessage: String,
    isCustom: { type: Boolean, default: false },
    createdBy: { type: String, ref: "User" },
  },
  { timestamps: true }
);

exerciseTemplateSchema.index({ groupType: 1, order: 1 });

export const ExerciseTemplate = mongoose.model<IExerciseTemplate>("ExerciseTemplate", exerciseTemplateSchema);
