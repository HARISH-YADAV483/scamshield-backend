import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

import uploadRoutes from "./routes/upload.routes.js";
import blogRoutes from "./routes/blog.routes.js";

app.use("/api/upload", uploadRoutes);
app.use("/api/blogs", blogRoutes);

connectDB();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));