import express from "express";
import dotenv from "dotenv";
import path from "path"
dotenv.config()
const app = express()

app.use(express.static(path.join(process.cwd(), "public")))

// Something has to go in here

app.get("/demo", (req, res) => {
    res.send("Server is up");
})

export default app;

