import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { connectDatabase } from "./config/database";
import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";
import clientRoutes from "./routes/client";
import exerciseRoutes from "./routes/exercises";
import notificationRoutes from "./routes/notifications";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/notifications", notificationRoutes);

// Error Handler
app.use(errorHandler);

// Database Connection
connectDatabase();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
