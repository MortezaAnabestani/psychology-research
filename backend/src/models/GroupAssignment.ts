import mongoose, { Schema, Document } from "mongoose";

export enum GroupType {
  CONTROL = "control",
  INTERVENTION = "intervention",
}

export interface IGroupAssignment extends Document {
  userId: string;
  groupType: GroupType;
  startDate: Date;
  completedDate?: Date;
  isActive: boolean;
  morningNotificationTime: string;
  createdAt: Date;
  updatedAt: Date;
}

const groupAssignmentSchema = new Schema<IGroupAssignment>(
  {
    userId: { type: String, required: true, ref: "User" },
    groupType: { type: String, enum: Object.values(GroupType), required: true },
    startDate: { type: Date, required: true },
    completedDate: Date,
    isActive: { type: Boolean, default: true },
    morningNotificationTime: { type: String, required: true },
  },
  { timestamps: true }
);

groupAssignmentSchema.index({ userId: 1, groupType: 1 });

export const GroupAssignment = mongoose.model<IGroupAssignment>("GroupAssignment", groupAssignmentSchema);
