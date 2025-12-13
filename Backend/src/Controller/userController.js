import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userModel } from "../Model/userModel.js";

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const userSignup = async (req, res) => {
    try {
        const {name, email, password, secret} = req.body;
        if(!name || !email || !password || !secret) {
            return res.status(400).json({message: "All fields are required", error: "Fields missing", data: null});
        }

        if(!emailPattern.test(email)) {
            return res.status(400).json({message: "Invalid email format", error: "Email format is incorrect", data: null});
        }

        const existUser = await userModel.findOne({email});
        if(existUser) {
            return res.status(400).json({message: "Email already registered", error: "Duplicate email", data: null});
        }

        const hashPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
        const hashSecret = await bcrypt.hash(secret, parseInt(process.env.SALT_ROUNDS));

        const newUser = new userModel({
            name,
            email,
            password: hashPassword,
            secret: hashSecret,
            profileImg: `https://robohash.org/${name}.svg`
        })
        await newUser.save();

        res.status(201).json({message: "Account created successfully", error: null, data: null});
    } catch (error) {
        console.log("Error in userSignup", error);
        res.status(500).json({message: "Internal Server Error", error: error.message, data: null});
    }
}

export const userLogin = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({message: "Email and Password are required", error: "Fields missing", data: null});
        }

        if(!emailPattern.test(email)) {
            return res.status(400).json({message: "Invalid email format", error: "Email format is incorrect", data: null});
        }

        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(400).json({message: "Invalid email or password", error: "Authentication failed", data: null});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({message: "Invalid email or password", error: "Authentication failed", data: null});
        }

        const token = jwt.sign({authorId: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.status(200).json({message: "Login successful", error: null, data: {
            name: user.name,
            email: user.email,
            profileImg: user.profileImg,
            createdAt: user.createdAt,
            token
        }});
    } catch (error) {
        console.log("Error in userLogin", error);
        res.status(500).json({message: "Internal Server Error", error: error.message, data: null});
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const {email, newPassword, secret} = req.body;
        if(!email || !newPassword || !secret) {
            return res.status(400).json({message: "All fields are required", error: "Fields missing", data: null});
        }

        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(400).json({message: "User not found", error: "Invalid email", data: null});
        }

        const isSecretValid = await bcrypt.compare(secret, user.secret);
        if(!isSecretValid) {
            return res.status(400).json({message: "Invalid secret answer", error: "Authentication failed", data: null});
        }

        const hashNewPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALT_ROUNDS));
        await userModel.findOneAndUpdate({email}, {password: hashNewPassword});

        res.status(200).json({message: "Password reset successfully", error: null, data: null});
    } catch (error) {
        console.log("Error in forgotPassword", error);
        res.status(500).json({message: "Internal Server Error", error: error.message, data: null});
    }
}

export const getUser = async (req, res) => {
    try {
        const authorId = req.body.authorId;
        const user = await userModel.findOne({_id: authorId}).select("-password -secret -updatedAt");
        if(!user) {
            return res.status(404).json({message: "User not found", error: "Invalid user", data: null});
        }

        res.status(200).json({message: "User fetched successfully", error: null, data: user});
    } catch (error) {
        console.log("Error in getUser", error);
        res.status(500).json({message: "Internal Server Error", error: error.message, data: null});
    }
}