import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: string;
  exerciseId: string;
  type: string;
  message: string;
  scheduledFor: Date;
  sentAt?: Date;
  readAt?: Date;
  clicked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true, ref: "User" },
    exerciseId: { type: String, required: true, ref: "UserExercise" },
    type: { type: String, required: true },
    message: { type: String, required: true },
    scheduledFor: { type: Date, required: true },
    sentAt: Date,
    readAt: Date,
    clicked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, scheduledFor: 1 });
notificationSchema.index({ sentAt: 1, clicked: 1 });

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);
