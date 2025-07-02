const express = require("express");
const cors = require("cors");
require("dotenv").config();
const ConnectToMongodb = require("./configs/connection");
const userModel = require("./models/user.model");
const { hash } = require("argon2");

const Auth = require("./routes/auth.route");
const User = require("./routes/user.route");
const Nasiya = require("./routes/nasiya.route");
const Paid = require("./routes/paid.route");
const Statisic = require("./routes/statistic.route");

const app = express();

app.use(express.json());
app.use(cors({ origin: "*", methods: ["POST", "GET", "PUT", "DELETE"] }));

app.use("/auth", Auth);
app.use("/user", User);
app.use("/nasiya", Nasiya);
app.use("/paid", Paid);
app.use("/statistic", Statisic);

const PORT = process.env.PORT || 9000;

const StartServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log("server is running");
    });
    await ConnectToMongodb();

    const admin = await userModel.findOne({ login: "admin@gmail.com" });

    if (!admin) {
      await userModel.create({
        username: "admin",
        login: "admin@gmail.com",
        password: await hash("admin"),
        role: "admin",
      });
      console.log("admin created");
    } else {
      console.log("there is already admin");
    }
  } catch (error) {
    console.error(error);
  }
};

StartServer();
