const express = require("express");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT;

const connectWithDb = require("./Config/database");
connectWithDb();

app.listen(PORT, ()=>{
    console.log("server started");
})

app.get("/", (req,res) =>{
    res.send(`<h1> this is my homepage </h1>`);
})