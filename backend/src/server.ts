import dotenv from "dotenv";
dotenv.config();
import express from "express";
import db from "./db/index.js";

const app = express();

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});


