const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://testuser:0QpsAQRgpJkIJfL3@cluster0.jyiybpf.mongodb.net/"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define schema for the user collection
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  dob: Date,
  gender: String,
  cast: String,
  city: String,
  family: Number,
  income: Number,
  religion: String,
  password: String,
  address: String,
  presentClass: String,
  course: String,
  createdAt: Date,
  updatedAt: Date,
});

// Define model for the user collection
const User = mongoose.model("users", userSchema);

// API endpoint to check constraints
// API endpoint to check constraints
app.get("/check-constraints", async (req, res) => {
  try {
    // Fetch user data from the database
    const user = await User.findOne({ email: "john@example.com" });

    // Check if user meets constraints
    if (
      user &&
      user.gender === "female" &&
      user.cast === "scbc" &&
      user.presentClass === "Class 9"
    ) {
      // Redirect the user to the eligible page
      res.redirect("F:/coding/hackathon/h3/HACK THE SPRING/Admin.html"); // Assuming Eligible.html is in the root directory
    } else {
      // Redirect the user to the not eligible page
      res.redirect("F:/coding/hackathon/h3/HACK THE SPRING/Admin.html");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
