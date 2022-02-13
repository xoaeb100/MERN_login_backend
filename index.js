import express from "express";
import cors from "cors";
import mongoose from "mongoose";

//configuration step; similar in every Node.js setup
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose.connect(
  "mongodb://localhost:27017/LoginRegister",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("db connected");
  }
);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login successfull", user: user });
      } else {
        res.send({ message: "Password didn't match :/ Enter again" });
      }
    } else {
      res.send({ message: "You're not registered :/" });
    }
  });
});

app.post("/register", (req, res) => {
  const { name, phone, email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "You're already registered!!" });
    } else {
      const user = new User({ name, phone, email, password });
      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "Successfully registered Now please Login" });
        }
      });
    }
  });
});
const port = 9002;
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});
