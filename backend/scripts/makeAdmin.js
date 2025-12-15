const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

// 1. Load Environment Variables
dotenv.config({ path: "../.env" }); // Adjust path to point to your backend .env

const makeAdmin = async () => {
  try {
    // 2. Connect to Database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // 3. The Email of the user you want to make Admin
    const targetEmail = "admin@gmail.com"; 

    // 4. Find and Update
    const user = await User.findOne({ email: targetEmail });
    if (!user) {
      console.log("User not found!");
      process.exit(1);
    }

    user.role = "admin";
    await user.save();

    console.log(`Success! User ${user.name} (${user.email}) is now an Admin.`);
    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

makeAdmin();