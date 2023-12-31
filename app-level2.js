//jshint esversion:6
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { default as encrypt } from "mongoose-encryption";

const port = 3000;
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect("mongodb://localhost:27017/userDB");

// New schema for using with high level of security
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const secret = "choosesecretkey";
// Will use plugin to encrypt the password and make the column as encryption
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  await newUser.save();
  res.render("secrets");
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.username,
    });

    // If found username, will check the password of the returned user
    if (user) {
      if (user.password === req.body.password) {
        res.render("secrets");
      }
      else {
        console.log("Invalid password");
      }
    } 
    else {
      console.log("Invalid userName");
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/submit", (req, res) => {});

app.listen(port, () => {
  console.log(`Listening to port: ${port}`);
});
