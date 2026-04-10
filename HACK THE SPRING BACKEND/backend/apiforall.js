const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const supabase = require("./supabaseClient");

// In production (Render), configure these via environment variables.
// Fallbacks are kept so local development still works.
const JWT_SECRET = process.env.JWT_SECRET || "scholarship-guide-secret-key-2024";
const SESSION_SECRET = process.env.SESSION_SECRET || "your-secret-key";

const app = express();
const port = process.env.PORT || 3000;

// Session store: MemoryStore is OK for local/dev but not for production scaling.
// (Render free tier typically runs one instance, but still better to migrate later.)
const store = new session.MemoryStore();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// CORS: allow local dev + deployed frontends.
// If you deploy the frontend (Netlify/Vercel/GitHub Pages), add that URL here too.
const allowedOrigins = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "https://scholarship-guide.onrender.com",
  "https://scholarship-guide-jade.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow non-browser requests (curl/postman) with no origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);

app.use(
  session({
    secret: SESSION_SECRET,
    cookie: { maxAge: 3600000 }, // 1 hour
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

// Middleware for session handling
const checkLoggedIn = (req) => {
  return !!req.session.email;
};

app.use((req, res, next) => {
  console.log(`${req.method}-${req.url}`);
  next();
});
// Contact Us
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }

    const { error } = await supabase
      .from('contact_messages')
      .insert([{ name, email, message }]);

    if (error) throw error;

    res.status(201).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Register
app.post("/register", async (req, res) => {
  try {
    const { email, password, name, dob, gender, caste, city, income, religion, address, presentClass, course } = req.body;

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          dob,
          gender,
          caste: caste,
          city,
          income,
          religion,
          password: hashedPassword,
          address,
          present_class: presentClass,
          course
        }
      ]);

    if (error) throw error;

    res.status(201).send();
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for hardcoded Admin Login
    if (email === "admin@scholarship.com" && password === "admin123") {
      req.session.email = email;
      const token = jwt.sign({ email, role: "admin" }, JWT_SECRET, { expiresIn: "24h" });
      return res.status(200).json({ message: "admin logged in", email, token, role: "admin" });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(400).send("Not Registered");
    }

    if (await bcrypt.compare(password, user.password)) {
      req.session.email = email;
      const token = jwt.sign({ email: email, role: "user" }, JWT_SECRET, { expiresIn: "24h" });
      res.status(200).json({ message: "user logged in", email: email, token: token, role: "user" });
    } else {
      res.status(400).json({ message: "wrong pwd" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

// JWT Middleware for protected routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const authenticateAdmin = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
  });
};

// Get user Details
app.get("/user", authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('name, email, dob, gender, caste, city, income, religion, address, present_class, course')
      .eq('email', req.user.email)
      .single();

    if (error || !user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Update User record
app.put("/user", authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('users')
      .update(req.body)
      .eq('email', req.user.email);

    if (error) throw error;

    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).send("Bad Request");
  }
});

// Cities
app.get("/city", async (req, res) => {
  try {
    const { data: cities, error } = await supabase.from('cities').select('*');
    if (error) throw error;
    res.send(cities);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Caste
app.get("/caste", async (req, res) => {
  try {
    const { data: castes, error } = await supabase.from('castes').select('*');
    if (error) throw error;
    res.send(castes);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Category (Present Class)
app.get("/category", async (req, res) => {
  try {
    const { data: categories, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    res.send(categories);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Course
app.get("/course", async (req, res) => {
  try {
    const { data: courses, error } = await supabase.from('courses').select('*');
    if (error) throw error;
    res.send(courses);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Check if logged in (JWT)
app.get("/loggedIn", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ message: "Logged in", email: decoded.email, role: decoded.role });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

// ====== SCHEME MANAGEMENT (ADMIN & PUBLIC) ======

// GET all schemes (Public & Admin)
app.get("/schemes", async (req, res) => {
  try {
    const { data: schemes, error } = await supabase.from('schemes').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.status(200).json(schemes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch schemes" });
  }
});

// GET schemes by category (Public)
app.get("/schemes/category/:category", async (req, res) => {
  try {
    // Decoding the possible URL encoded category
    const category = decodeURIComponent(req.params.category);
    const { data: schemes, error } = await supabase
      .from('schemes')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.status(200).json(schemes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch schemes for category" });
  }
});

// POST new scheme (Admin Only)
app.post("/admin/schemes", authenticateAdmin, async (req, res) => {
  try {
    const { scheme_name, category, description, eligibility_criteria, documents_required, benefits, steps_for_applying } = req.body;
    const { data, error } = await supabase.from('schemes').insert([
      { scheme_name, category, description, eligibility_criteria, documents_required, benefits, steps_for_applying }
    ]).select();
    if (error) throw error;
    res.status(201).json({ message: "Scheme added successfully", scheme: data[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add scheme" });
  }
});

// PUT update scheme (Admin Only)
app.put("/admin/schemes/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('schemes').update(req.body).eq('id', id);
    if (error) throw error;
    res.status(200).json({ message: "Scheme updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update scheme" });
  }
});

// DELETE scheme (Admin Only)
app.delete("/admin/schemes/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('schemes').delete().eq('id', id);
    if (error) throw error;
    res.status(200).json({ message: "Scheme deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete scheme" });
  }
});

// ====== CONTACT MESSAGES (ADMIN) ======

// GET all contact messages (Admin Only)
app.get("/admin/contact-messages", authenticateAdmin, async (req, res) => {
  try {
    const { data: messages, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.status(200).json(messages);
  } catch (error) {
    console.error("Fetch contact messages error:", error);
    res.status(500).json({ error: "Failed to fetch contact messages" });
  }
});

// DELETE a contact message (Admin Only)
app.delete("/admin/contact-messages/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) throw error;
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Delete contact message error:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

app.get("/", (req, res) => {
  res.send(" Scholarship Guide Backend is Running!");
});

// ================================================

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port} (Supabase Backend)`);
});
