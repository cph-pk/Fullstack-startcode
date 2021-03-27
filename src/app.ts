import express from "express";
import dotenv from "dotenv";
dotenv.config()
import path from "path";
import friendRoutes from "./routes/FriendRoutesAuth";
import { ApiError } from "./errors/apiError";
const app = express();
import { Request, Response } from "express";
import simpleLogger from "./middleware/simpleLogger";
// import myCors from "./middleware/myCors";
// app.use(myCors);

// Cors package
// const cors = require('cors');
// app.use(cors());


// Logger
import logger, { stream } from "./middleware/logger";
const morganFormat = process.env.NODE_ENV == "production" ? "combined" : "dev"
app.use(require("morgan")(morganFormat, { stream }));
app.set("logger", logger) 
//The line above sets the logger as a global key on the application object
//You can now use it from all your middlewares like this req.app.get("logger").log("info","Message")
//Level can be one of the following: error, warn, info, http, verbose, debug, silly
//Level = "error" will go to the error file in production

// Simple logger
//app.use(simpleLogger);


app.use(express.static(path.join(process.cwd(), "public")))
app.use("/api/friends", friendRoutes)


app.get("/demo", (req, res) => {
    res.send("Server is up");
})


// Default 404 handlers for api-requests
app.use("/api", (req, res, next) => {
    res.status(404).json({ errorCode: 404, msg: "not found" })
})

// Makes JSON error-response for ApiErrors, otherwise pass on to default error handleer
app.use((err: any, req: Request, res: Response, next: Function) => {
    if (err instanceof (ApiError)) {
        res.status(err.errorCode).json({ errorCode: err.errorCode, msg: err.message })
    } else {
        next(err)
    }
})

export default app;

