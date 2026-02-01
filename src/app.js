import express from "express";
import cors from "cors";
import scamRoutes from "./routes/scam.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import phishingRoutes from "./routes/phishing.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// middleware

app.use(
  cors({
    origin: "https://scamshiild-2.onrender.com",
    credentials: true,
  })
);
app.use(express.json());

// routes
app.use("/api/scams", scamRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/phishing", phishingRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.status(200).send("✅ ScamShield Backend is Running!");
});

app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "✅ Backend Connected Successfully!" });
});

export default app;

