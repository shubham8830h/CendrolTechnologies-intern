const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");
dotEnv.config();
const { uploadImageToCloudinary } = require("../utils/imageUploader");
//login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, "secretKey");
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Authentication error" });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    const Profile_picture = req.files.Profile_picture;

    const image = await uploadImageToCloudinary(
      Profile_picture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    const newUser = new userModel({
      name,
      email,
      mobile,
      Profile_picture: image.secure_url,
      password,
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user" });
  }
};

// Update user by ID
exports.updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

// Delete user by ID
exports.deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await userModel.findByIdAndRemove(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user" });
  }
};
