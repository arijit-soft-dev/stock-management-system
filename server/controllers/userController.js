const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateToken = (id) => {
  return jwt.sign({ id }, 
  process.env.JWT_SECRET, { expiresIn: "1d" });
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
  const {email, password} = req.body;
  //validate request
  if (!email || !password){
    res.status(400);
    throw new Error("Please add email and password");
  }

  //check if user exists
  const user = await User.findOne({email});
  if (!user){
    res.status(400);
    throw new Error("User not found, please register");
  }
  //user exists, check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);
  
  //generate token
  const token = generateToken(user._id);
  //send httponly
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    // sameSite: "none",
    // secure: true
  });
  
  if (user && passwordIsCorrect){
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
  }
  else{
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

//logout user
const logoutUser = asyncHandler(async(req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true
  });
  return res.status(200).json({message: "Successfully logged out"});
})

//get user data 
const getUser = asyncHandler(async(req, res) => {
  const user = await User.findById(req.user._id);

  if (user){
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("User not found");

  }

  
});


//get login status
const loggedInStatus = asyncHandler(async(req, res) => {
  const token = req.cookies.token;
  if (!token){
    return res.json(false);
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
      return res.json(true);
    }
    else{
      return res.json(false);
    }
  } catch (error) {
    return res.json(false);
  }
});
//update user
const updateUser = asyncHandler(async(req, res) => {
  const user = await User.findById(req.user._id);
  if (user){
    const {name, email, photo, phone, bio} = user;
    user.email = email;
    user.name = req.body.name || name;
    user.photo = req.body.photo || photo;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      photo: updatedUser.photo,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
    })
  }
  else{
    res.status(404);
    throw new Error("User not found");
  }

});

//change password
const changePassword = asyncHandler(async(req, res) => {
  const user = await User.findById(req.user._id);
  if (user){
    const {oldPassword, password} = req.body;
    if (!oldPassword || !password){
      res.status(400);
      throw new Error("Please add old and new password");
    }
    else{
    const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);
    if (user && passwordIsCorrect){
      user.password = password;
      await user.save();
      res.status(200).send("Password change successful");
    }
    else{
      res.status(400);
      throw new Error("Old password is incorrect");
    }
  }

  }
  else{
    res.status(404);
    throw new Error("User not found");
  }


});

module.exports = { registerUser, 
  changePassword, loginUser, logoutUser, getUser, loggedInStatus, updateUser };
