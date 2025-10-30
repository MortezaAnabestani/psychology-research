import mongoose, { Schema, Document } from "mongoose";

export interface IAdminSettings extends Document {
  allowHistoryAccess: boolean;
  randomNotificationRanges: {
    morning: { start: string; end: string };
    afternoon: { start: string; end: string };
    evening: { start: string; end: string };
  };
  updatedBy: string;
  updatedAt: Date;
}

const adminSettingsSchema = new Schema<IAdminSettings>(
  {
    allowHistoryAccess: { type: Boolean, default: false },
    randomNotificationRanges: {
      morning: { start: String, end: String },
      afternoon: { start: String, end: String },
      evening: { start: String, end: String },
    },
    updatedBy: { type: String, ref: "User" },
  },
  { timestamps: true }
);

export const AdminSettings = mongoose.model<IAdminSettings>("AdminSettings", adminSettingsSchema);
