const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoute");
const errorHandler = require("./middleware/errorMiddileWare");
const cookieParser = require("cookie-parser");

const app = express();

//middilewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
//routes middileware
app.use("/api/users", userRoute);

// routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

//error middileware
app.use(errorHandler);

//mongodb connection

const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
