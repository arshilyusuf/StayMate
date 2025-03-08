const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find(); // Fetch all users
  console.log("🔹 Retrieved Users:", users); // Debugging

  if (users.length === 0) {
    console.log("⚠️ No users found in the database.");
  }

  res.status(200).json({
    message: "All users retrieved successfully",
    data: {
      length: users.length,
      users,
    }, // Return users directly
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.createUser = async (req, res) => {
  try {
    // Create a new user with the request body data
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: "success",
      message: "User created successfully!",
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Failed to create user",
      error: error.message,
    });
  }
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
