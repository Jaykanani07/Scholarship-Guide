const jwt = require("jsonwebtoken");
const JWT_SECRET = "scholarship-guide-secret-key-2024";

// Create token
const token = jwt.sign({ email: "admin@scholarship.com", role: "admin" }, JWT_SECRET, { expiresIn: "1h" });

const payload = {
  scheme_name: "Test Scheme",
  category: "Education",
  description: "Test description",
  eligibility_criteria: "Test eligibility",
  documents_required: "Test docs",
  benefits: "Test benefits",
  steps_for_applying: "Test steps"
};

fetch("http://localhost:3000/admin/schemes", {
  method: "POST",
  headers: {
    "Authorization": "Bearer " + token,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
})
.then(res => Promise.all([res.status, res.json()]))
.then(([status, body]) => {
  console.log("Status:", status);
  console.log("Response:", body);
})
.catch(err => console.error("Error:", err));
