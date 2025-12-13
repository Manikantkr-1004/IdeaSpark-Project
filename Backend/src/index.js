import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import userRouter from "./Route/userRoute.js";
import ideaRouter from "./Route/ideaRoute.js";
import { connectToMongoDB } from "./Config/mongodbConfig.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json( { limit: "10mb" } )); // this is for parsing json data from request body
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // this is for parsing form data from request body
app.disable('x-powered-by'); // this is to disable x-powered-by header from response headers

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));

app.get("/", (req, res) => {    
    res.send("Welcome to IdeaSpark API");
});

app.use("/user", userRouter);
app.use("/idea", ideaRouter);

app.listen(PORT, async() => {
    try {
        await connectToMongoDB();
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.log("Error in starting server: ", error);
    }
});