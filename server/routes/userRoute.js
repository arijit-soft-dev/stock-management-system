const express = require("express");
const { registerUser, loginUser, logoutUser, getUser, loggedInStatus, updateUser, changePassword } = require("../controllers/userController");
const protect = require("../middleware/authMiddileWare");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getuser", protect, getUser);
router.get("/loggedinstatus", loggedInStatus);
router.patch("/updateuser",protect, updateUser);
router.patch("/changepassword", protect, changePassword );

module.exports = router;
