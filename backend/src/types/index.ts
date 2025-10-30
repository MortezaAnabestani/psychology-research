export enum UserRole {
  ADMIN = "admin",
  CLIENT = "client",
}

export enum GroupType {
  CONTROL = "control",
  INTERVENTION = "intervention",
}

export enum ExerciseStatus {
  LOCKED = "locked",
  AVAILABLE = "available",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

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

// User Interface
export interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  preferences?: {
    morningNotificationTime?: string; // HH:mm format
    allowHistoryAccess?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Group Assignment
export interface IGroupAssignment {
  _id: string;
  userId: string;
  groupType: GroupType;
  startDate: Date;
  completedDate?: Date;
  isActive: boolean;
  morningNotificationTime: string; // Selected by user at start
  createdAt: Date;
}

// Exercise Template (Created by Admin)
export interface IExerciseTemplate {
  _id: string;
  title: string;
  groupType: GroupType;
  order: number; // 1, 2, 3, 4, 5
  description: string;
  instructions: string;

  // Notification Configuration
  notifications: {
    type: NotificationType;
    count: number; // How many notifications per day
    scheduleType: "fixed" | "random" | "user_time";
    times?: string[]; // For fixed times: ["13:00", "18:00", "21:00"]
    timeRanges?: Array<{ start: string; end: string }>; // For random: [{ start: "10:00", end: "12:00" }]
    messages: string[]; // Notification messages
  }[];

  // Form Fields
  fields: {
    id: string;
    type: FieldType;
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[]; // For radio, checkbox
    min?: number; // For scale
    max?: number; // For scale
    order: number;
  }[];

  completionMessage?: string;
  isCustom: boolean; // true if created by admin, false if predefined
  createdBy: string; // Admin ID
  createdAt: Date;
  updatedAt: Date;
}

// User Exercise Instance (Specific exercise for a user)
export interface IUserExercise {
  _id: string;
  userId: string;
  groupAssignmentId: string;
  exerciseTemplateId: string;
  status: ExerciseStatus;

  // Tracking
  startedAt?: Date;
  completedAt?: Date;
  lastAccessedAt?: Date;

  // Responses
  responses: {
    fieldId: string;
    value: string | string[] | number;
    answeredAt: Date;
  }[];

  // Scheduled Time (if user needs to do at specific time)
  scheduledTime?: string;

  createdAt: Date;
  updatedAt: Date;
}

// Notification Log
export interface INotification {
  _id: string;
  userId: string;
  exerciseId: string;
  type: NotificationType;
  message: string;
  scheduledFor: Date;
  sentAt?: Date;
  readAt?: Date;
  clicked: boolean;
  createdAt: Date;
}

// Admin Settings
export interface IAdminSettings {
  _id: string;
  allowHistoryAccess: boolean; // Global setting
  randomNotificationRanges: {
    morning: { start: string; end: string };
    afternoon: { start: string; end: string };
    evening: { start: string; end: string };
  };
  updatedBy: string;
  updatedAt: Date;
}

// Statistics Interface
export interface IUserStatistics {
  userId: string;
  totalExercises: number;
  completedExercises: number;
  inProgressExercises: number;
  completionRate: number;
  averageCompletionTime: number; // in minutes
  lastActivityDate: Date;
  groupProgress: {
    control: {
      total: number;
      completed: number;
    };
    intervention: {
      total: number;
      completed: number;
    };
  };
}

// Export Data Interface
export interface IExportData {
  user: {
    id: string;
    name: string;
    email: string;
  };
  groupType: GroupType;
  exercise: {
    title: string;
    order: number;
  };
  responses: {
    question: string;
    answer: string | string[] | number;
  }[];
  startedAt?: Date;
  completedAt?: Date;
  timeSpent?: number; // in minutes
}
