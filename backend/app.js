const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const issueRoutes = require("./routes/issueRoutes");
const commentRoutes = require("./routes/commentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middlewares
app.use(express.json());

app.use(
  cors({
    origin: "https://team-issue-and-task-management-syst.vercel.app",
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
