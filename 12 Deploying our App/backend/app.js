const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

mongoose
  .connect(
    "mongodb+srv://"+process.env.MONGO_ATLAS_USRN + ":" + process.env.MONGO_ATLAS_PW + process.env.MONGO_CLUSTER_DEFINITION
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("connection to database failed ");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/", express.static(path.join(__dirname, "angular")));


app.use("/posts", postsRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
})
module.exports = app;
