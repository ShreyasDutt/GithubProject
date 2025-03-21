import express from 'express';
import env from 'dotenv';
import DBconnect from "./db/mongoDBConnection.js";
import router from "./routes/Routes.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";


env.config();
const PORT = process.env.PORT || 3000;
const app = express();


app.set("view engine", "ejs");

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static( 'public'));
app.use(cookieParser());

// Routes
app.use("/", router);


app.listen(PORT, async ()=>{
    try{
        await DBconnect();
        console.log("Server started on port: " + PORT);
    }
    catch(err){
        console.log(err.message);
    }
});
