const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB().then(()=>{
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", 
  credentials: true
}));
  
  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/expenses", require("./routes/expenseRoutes"));
  app.use("/api/tasks", require("./routes/taskRoutes"));
  app.use("/api/admin", require("./routes/adminRoutes"));
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log("Server running on port " + PORT));

})

