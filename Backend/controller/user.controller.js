import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookie from "../jwt/generateToken.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";





export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {

    if([fullname, email, password].some((field) => field?.trim() === "")){
      return res.status(400).json({ error: "All fields are required" });
    }


    const existingUser = await User.findOne({email})

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // const avatarLocalPath = req.files?.avatar[0]?.path;
    const avatarLocalPath = req.file?.path;
    console.log(avatarLocalPath);

    if(!avatarLocalPath){
      return res.status(400).json({ error: "Please upload an avatar" });
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    console.log(avatar);

    if(!avatar) {
      return res.status(400).json({ error: "Failed to upload avatar to cloudinary" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      fullname, 
      email, 
      avatar: avatar.url,
      password: hashedPassword });

    await user.save();

    if (user) {
      createTokenAndSaveCookie(user._id, res);
      res.status(201).json({
        message: "User created successfully",
        user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar,
        }
      });
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
   
};





export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user || !isMatch) {
      return res.status(400).json({ error: "Invalid user credential" });
    }
    user.lastLogin = new Date(); // Assuming lastLogin is a field in your user schema
    await user.save();

    createTokenAndSaveCookie(user._id, res);
    res.status(201).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        lastLogin: user.lastLogin, 
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};





export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(201).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};




export const allUsers = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");
    res.status(201).json(filteredUsers);
  } catch (error) {
    console.log("Error in allUsers Controller: " + error);
  }
};
