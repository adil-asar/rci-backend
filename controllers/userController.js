import User from "../models/userModel.js";
import bcrypt, { compareSync } from "bcryptjs";
import { signUpSchema, signInSchema } from "../validations/user.js";
import { generateToken, verifyToken } from "../config/token.js";
import { sendVerificationEmail } from "../config/mailer.js";

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

    const { username, email, password, role } = result.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "A user with this email already exists" });
    }

    const user = await User.create({
      username,
      email,
      password,
      role,
      active: false,
    });

    const token = generateToken(user);

    const verificationUrl = `https://dev.replicacopyindustries.com/verify-email?token=${token}`;

    await sendVerificationEmail({ email, username, verificationUrl });

    res.status(200).json({
      message:
        "User registered successfully. Please confirm your email to activate your account.",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        active: user.active,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
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

    // Check if user is active (email verified)
    if (!user.active) {
      return res
        .status(403)
        .json({ error: "Please verify your email to activate your account." });
    }

       if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT
    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
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
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }) 
      .sort({ createdAt: -1 })
      .select("username email password role");

    res.status(200).json({
      total: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const users = await User.find({ role: "admin" })
      .sort({ createdAt: -1 })
      .select("username email password role");

    res.status(200).json({
      total: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const googleSignin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "No token provided" });
  }

  try {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );
    if (!response.ok) {
      return res.status(400).json({ error: "Invalid Google token" });
    }

    const data = await response.json();
    const { email, name, sub: googleId } = data;

    if (!email || !name || !googleId) {
      return res.status(400).json({ error: "Incomplete Google data" });
    }

    // Check for existing user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: name,
        email,
        password: googleId,
        role: "user",
        active: true, // Automatically activate user on Google sign-in
      });
    }

    const userToken = generateToken(user);

    res.status(200).json({
      message: "Google login successful",
      user,
      token: userToken,
    });
  } catch (error) {
    console.error("Google Sign-In error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const verifyEmail = async (req, res) => {
  const user = req.user.id;
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const verifiedUser = await User.findByIdAndUpdate(
      user,
      { active: true },
      { new: true }
    );

    if (!verifiedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Email verified successfully",
      user: {
        _id: verifiedUser._id,
        username: verifiedUser.username,
        email: verifiedUser.email,
        role: verifiedUser.role,
        active: verifiedUser.active,
        createdAt: verifiedUser.createdAt,
        updatedAt: verifiedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

