import jwt from 'jsonwebtoken';
import { userModel } from '../Model/userModel.js';

export const userAuthenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({message: "Token is missing, Please login", error: "Unauthorized", data: null});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return  res.status(401).json({message: "Invalid Token, Please login", error: "Unauthorized", data: null});
        }

        const userExist = await userModel.findOne({_id: decoded.authorId});
        if (!userExist) {
            return res.status(401).json({message: "User does not exist, Please signup", error: "Unauthorized", data: null});
        }
        
        req.body = { authorId: decoded.authorId, ...req.body}
        next();
    } catch (error) {
        console.log("Error in userAuthentication", error);
        res.status(500).json({message: "Internal Server Error", error: error.message, data: null});
    }
}