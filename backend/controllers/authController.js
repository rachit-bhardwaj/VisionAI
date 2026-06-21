const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

// Registration controller ------------------------------------
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, age, gender, phone } = req.body;

        // Check all fields

        if (!name || !email || !password || !age || !gender || !phone) {
            return res.status(400).json({
                success: false,
                message: "Please provide all fields",
            });
        }

        // Check existing user

        const existingUser = await User.findOne({
            email,
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Hash Password

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );

        // Create User

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            age,
            gender,
            phone
        });

        // Generate JWT

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                age: user.age,
                gender: user.gender,
                phone: user.phone,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Login User Controller ---------------------------------------------------
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check fields

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }

        // Find user

        const user = await User.findOne({ email })
            .select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Compare password

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate token

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                age: user.age,
                gender: user.gender,
                phone: user.phone,
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Logout ------------------------------------------------------------
exports.logoutUser = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Forgot Password -------------------------------------------------------

exports.forgotPassword = async (req, res) => {
    try {

        const user =
            await User.findOne({
                email: req.body.email,
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const resetToken =
            user.getResetPasswordToken();

        await user.save({
            validateBeforeSave: false,
        });

        const resetUrl =
            `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        const message = `Password Reset Request 
        Reset your password using: ${resetUrl} 
        This link expires in 15 minutes.`;

        // await sendEmail({
        //     email: user.email,
        //     subject:
        //         "VisionAI Password Reset",
        //     message,
        // });

        console.log("Reset URL:", resetUrl);

        res.status(200).json({
            success: true,
            resetUrl,
        });

        res.status(200).json({
            success: true,
            message:
                "Password reset email sent",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken =
      crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user =
      await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
          $gt: Date.now(),
        },
      });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired token",
      });
    }

    const salt =
      await bcrypt.genSalt(10);

    user.password =
      await bcrypt.hash(
        req.body.password,
        salt
      );

    user.resetPasswordToken =
      undefined;

    user.resetPasswordExpire =
      undefined;

    await user.save();

    const token =
      generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      message:
        "Password reset successful",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};