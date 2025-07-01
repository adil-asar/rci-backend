import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { signUpSchema, signInSchema } from "../validations/user.js";
import { generateToken, verifyToken } from "../config/token.js";
export const Signup = async (req, res) => {

     try {
    const result = signUpSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.reduce((acc, err) => {
        const field = err.path[0];
        if (!acc[field]) {
          acc[field] = err.message;
        } else {
          acc[field] += `, ${err.message}`;
        }
        return acc;
      }, {});
      return res.status(400).json({ errors });
    }

    const { username,  email, password, role } = result.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "A user with this email already exists" });
    }

    ;

    const user = await User.create({
      username,
      email,
      password,
      role,
    });

    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      password: user.password, 
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }

};

export const Signin = async (req, res) => {
  try {
    const validationResult = signInSchema.safeParse(req.body);
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.errors.reduce(
        (acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        },
        {}
      );
      return res.status(400).json({ errors: formattedErrors });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }

   
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = generateToken(user);

    res.status(200).json({
      user_Token: token,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
};

export const ValidateUser = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res
      .status(200)
      .json({ user: user, message: "User validated successfully" });
  } catch (error) {
    console.error("Validation error:", error);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
}


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .sort({ createdAt: -1 }) // optional: sort latest first
      .select("username email password"); // only select needed fields

    res.status(200).json({
      total: users.length,
      data: users,
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

