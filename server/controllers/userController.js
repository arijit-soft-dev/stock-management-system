const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { response } = require("express");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//regesteruser
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, photo, phone, bio } = req.body;

  //validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be up to 6 characters");
  }

  //check if user email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email has already been registered");
  }

  //create user
  const user = await User.create({
    name,
    email,
    password,
    photo,
    phone,
    bio,
  });

  const token = generateToken(User._id);
  //send httponly
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    // sameSite: "none",
    // secure: true
  });
  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});
// const registerUser = async(req, res) => {
//     if (!req.body.email){
//         res.status(400)
//         throw new Error("Email is required");

//     }
//     res.send("Register User");
// };

//loginuser
const loginUser = asyncHandler(async (req, res) => {
  res.send("login USer");
});

module.exports = { registerUser, loginUser };
