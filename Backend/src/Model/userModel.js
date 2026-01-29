import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: [false, "Password required for credentials login"],  // ← Made optional
    minlength: 6 
  },
  secret: { type: String, required: true },
  image: { type: String, required: true },
  loginHistory: [
    {
      date: { type: Date },
      provider: { type: String, enum: ['credentials', 'google', 'github'] }
    }
  ]
}, { timestamps: true, versionKey: false });


export const userModel = mongoose.model("users", userSchema);