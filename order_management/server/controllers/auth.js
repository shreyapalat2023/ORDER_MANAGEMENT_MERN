import User from "../models/user.model.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log("📥 Incoming register:", req.body);

    // Validation
    if (!username.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is taken" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Save user
    const user = await new User({ username, email, password: hashedPassword }).save();

    // Generate token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    // Respond
    res.json({
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        address: user.address
      },
      token
    });

  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ error: "Internal Server Error" }); // ✅ sends response
  }
};


//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.json({ error: "Email is taken" });
    }
    if (!password || password.length < 6) {
      return res.json({ error: "Password must be at least 6 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    //verfifying user with email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "User not found" });
    }
    //compare password 
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({ error: "User not found." })
    }

    // 5.create signed jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    // 7.send response
    res.json({
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        address: user.address,
      }, token,
    });

  } catch (err) {
    console.log(err);

  }
}


// ... other exports above ...

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("user otp:", otp)
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Email configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your OTP for Password Reset",
      html: `
        <p>Hello ${user.username || user.email},</p>
        <p>Your OTP for password reset is:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent to email", otp }); // optional: remove `otp` in prod

  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

//verify otp
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (
    !user ||
    user.otp !== otp ||
    !user.otpExpiry ||
    user.otpExpiry < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  res.json({ message: "OTP verified" });
}

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your New OTP for Password Reset",
      html: `
        <p>Hello ${user.username || user.email},</p>
        <p>Your new OTP for password reset is:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "New OTP has been sent to your email" });

  } catch (err) {
    console.error("Resend OTP error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// reset Password with OTP

export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log("email", email, newPassword);
    
    if (!newPassword || newPassword.length < 6) {
      return res.json({ error: "Password must be at least 6 characters long" });
    }
    const user = await User.findOne({ email });
    user.password = await hashPassword(newPassword);
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });

  } catch (err) {
    console.error("Reset password with OTP error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

