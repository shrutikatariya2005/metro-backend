// src/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import stationRoutes from "./routes/station.routes.js";
import routeRoutes from "./routes/route.routes.js";
import fareRoutes from "./routes/fare.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import scheduleRoutes from "./routes/schedule.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import reportRoutes from "./routes/report.routes.js";
import userManagementRoutes from "./routes/userManagement.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://metro-frontend-alpha.vercel.app",
  "https://metro-frontend-nu.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman) or matching allowed origins
      if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) {
        callback(null, true);
      } else {
        callback(null, true); // Allow origin fallback for preview deployments
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Mount routers
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/stations", stationRoutes);
app.use("/api/v1/routes", routeRoutes);
app.use("/api/v1/fares", fareRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/tickets", ticketRoutes);
app.use("/api/v1/schedules", scheduleRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/users", userManagementRoutes);
app.use("/api/v1/payments", paymentRoutes);

app.use(errorHandler);

export default app;
