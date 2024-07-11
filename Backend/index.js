import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./SocketIO/server.js";

dotenv.config({
    path: "./env"
  });

// middleware
app.use(cookieParser());
app.use(cors());

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));

app.use(express.static("public"));


const PORT = process.env.PORT || 3001;
const URI = process.env.MONGODB_URI;

try {
    mongoose.connect(URI);
    console.log("Connected to MongoDB");
} catch (error) {
    console.log(error);
}

//routes
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

//............................code for development................
if(process.env.NODE_ENV === "production"){
    const dirPath = path.resolve();
    app.use(express.static('./Frontend/dist'));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(dirPath, 'Frontend/dist/index.html'));
    });
}

server.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`);
});