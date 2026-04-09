const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// const initPassPort = require('./passport-config');
// initPassPort(passport,email=>{
//     return users.find(user=>user.email===email)
// })

app.use(express.json());

const users = [];
let count = 1;

app.get("/user", (req, res) => {
  res.json(users);
});

app.post("/register", async (req, res) => {
  try {
    const hashedPwd = await bcrypt.hash(req.body.pwd, 5);
    users.push({
      id: count,
      email: req.body.email,
      pwd: hashedPwd,
    });
    count += 1;
    res.status(200).send("Done Reg");
  } catch (error) {
    console.log(error);
    res.status(400).send("issue in req");
  }
  console.log(users);
});

app.post("/login", async (req, res) => {
  const user = users.find((user) => user.email === req.body.email);
  if (user === null) {
    return res.status(400).send("not reg");
  }
  try {
    if (await bcrypt.compare(req.body.pwd, user.pwd)) {
      res.send("user logged in");
    } else {
      res.status(400).send("wrong pwd");
    }
  } catch (error) {
    res.status(500).send();
  }

  res.status(200).send();
});


app.get('/', (req, res) => {
res.send('Backend is running!');
});

app.listen(3000);
