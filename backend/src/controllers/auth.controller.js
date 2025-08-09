import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/util.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {

    if (!fullName || !email || !password) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).send({ message: 'Password must be at least 6 characters long' });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).send({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save(); 
      
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        token: generateToken(newUser._id, res),
      });
    } else {
      return res.status(400).send({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profillePic: user.profilePic,
      token: generateToken(user._id, res),
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie('jwt', "", { maxAge: 0 });
    res.status(200).send({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error('Error during auth check:', error.message);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}