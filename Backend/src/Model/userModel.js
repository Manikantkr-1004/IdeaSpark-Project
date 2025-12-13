import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 3, error: "Name must be at least 3 characters long."},
    email: {type: String, required: true, unique: true, error: "Email is required and must be unique."},
    password: {type: String, required: true, minlength: 6, error: "Password must be at least 6 characters long."},
    secret: {type: String, required: true, error: "Secret is required."},
    profileImg: {type: String, required: true, error: "Profile image URL is required."},
}, { timestamps: true , versionKey: false});

export const userModel = mongoose.model("users", userSchema);