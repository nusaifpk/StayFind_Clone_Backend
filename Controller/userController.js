import users from '../Model/userSchema.js'
import { joiUserSchema } from '../Model/validationSchema.js'
import bcrypt from "bcrypt"
import { sendOTP } from "./Verify_OTP.js"
import jwt from 'jsonwebtoken'
import properties from '../Model/propertySchema.js'


export const userRegister = async (req, res, next) => {
  try {
    const { value, error } = joiUserSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }

    const { name, email, phone, username, password } = value;

    // Check username already exists
    const existingUser = await users.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Username already taken!",
      });
    }

    // Send OTP
    await sendOTP(req, res);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new users({
      name: name,
      email: email,
      phone: phone,
      username: username,
      password: hashedPassword,
    });

    // Save new user to database
    await newUser.save();

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};


export const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check user
    const user = await users.findOne({ username });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Invalid username or password",
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid username or password",
      });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.USER_ACCESS_TOKEN_SECRET, {
      expiresIn: "1h"
    });

    return res.status(200).json({
      status: "success",
      message: "User login successful",
      token: token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
      error: error.message
    });
  }
};


export const viewProperty = async (req,res) => {
  try{
    const allProducts = await properties.find()

    if(!allProducts){
      return res.status(404).json({
        status:"error",
        message:"No property found...!"
      })
    }

    return res.status(200).json({
      status:"success",
      message:"fetched all properties",
      data:allProducts
    })
  }
  catch(error){
    res.status(500).json({
      status:"error",
      message:error
    })
  }
}