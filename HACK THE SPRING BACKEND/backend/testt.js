const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cast_model = require("./caste_model");
const presentclass = require("./presentclass");
const course = require("./course_model");

const dotenv = require("dotenv");
const cors = require("cors"); // Import cors

const User = require("./userModel");
const City = require("./cityModel");

dotenv.config();

const app = express();
app.use(express.json());

// Use cors middleware
app.use(cors()); // This enables CORS for all routes

const SECRET_KEY = process.env.SECRET_KEY;

// Middleware to protect routes
const jwtMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401); // If there's no token, return 401 (Unauthorized)

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // If the token is invalid, return 403 (Forbidden)
    // console.log(user);
    req.user = user; // Attach the user to the request object
    next(); // Proceed to the next middleware or route handler
  });
};

// Login
app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user === null) {
    return res.status(400).send("Not Registered");
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      // Generate a JWT
      console.log(user);
      const token = jwt.sign({ email: user.email }, SECRET_KEY, {
        expiresIn: "1h",
      });
      res.status(200).json({ token }); // Return the token
    } else {
      res.status(400).send("wrong pwd");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

// Logged out route
app.get("/logout", (req, res) => {
  res.json({ message: "You have been logged out." });
});

app.get("/loggedIn", jwtMiddleware, (req, res) => {
  res.status(200).send();
});

// Protected route
app.get("/protected", jwtMiddleware, (req, res) => {
  // Assuming the user object in the JWT payload looks like this: { user: 'John', age: 30 }
  const user = req.user;
  console.log(user);

  // Check if the user is "John"
  if (user === "a") {
    // If the user is "John", return the user's age
    res.json({ message: "You are in the protected route!", age: req.user });
  } else {
    // If the user is not "John", return an error message
    res.status(403).json({ message: "Access denied. You are not John." });
  }
});

app.get("/user", jwtMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select({
      _id: 0,
      name: 1,
      email: 1,
      dob: 1,
      gender: 1,
      cast: 1,
      city: 1,
      family: 1,
      income: 1,
      religion: 1,
      address: 1,
      presentClass: 1,
      course: 1,
    });
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
app.get("/caste", async (req, res) => {
  try {
    const data = await cast_model.find({}, "caste");
    res.json(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/course", async (req, res) => {
  try {
    const data = await course.find({}, "course");
    res.json(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/category", async (req, res) => {
  try {
    const data = await presentclass.find({}, "name");
    res.json(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// // Cities
app.get("/city", async (req, res) => {
  try {
    const cities = await City.find();
    res.send(cities);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/register", async (req, res) => {
  try {
    try {
      const { email } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Email is already registered" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      
      name: req.body.name,
      email: req.body.email,
      dob: req.body.dob,
      gender: req.body.gender,
      caste: req.body.caste,
      city: req.body.city,
      family: req.body.family,
      income: req.body.income,
      religion: req.body.religion,
      password: hashedPassword,
      address: req.body.address,
      presentClass: req.body.presentClass,
      course: req.body.course,
    });

    console.log(user)
    await user.save();

    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

app.get("/check-constraints", jwtMiddleware, async (req, res) => {
  try {
    // Fetch user data from the database
    const user = await User.findOne({ email: req.user.email }); // Assuming email is stored in req.user.email

    console.log(user);
    // Check if user meets constraints
    if (
      user &&
      user.gender === "female" &&
      user.caste === "General" &&
      user.presentClass === "Class 9"
    ) {
      // Send 'Eligible' as response
      res.send("Eligible");
    } else {
      // Send 'Not Eligible' as response
      res.send("Not Eligible");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

const port = process.env.PORT || 3000;
mongoose
  .connect(
    "mongodb+srv://testuser:0QpsAQRgpJkIJfL3@cluster0.jyiybpf.mongodb.net/"
  )
  .then(() => {
    console.log("Connected to MongoDB");

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });
