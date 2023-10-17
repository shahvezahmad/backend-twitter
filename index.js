const express = require("express");
const app = express();
require("dotenv").config();

app.use("/images", express.static("images"));
app.use(express.json());

const route = require("./Routes/route");

app.use("/api", route);

const PORT = process.env.PORT;

const connectWithDb = require("./Config/database");
connectWithDb();

app.listen(PORT, ()=>{
    console.log("server started");
})

app.get("/", (req,res) =>{
    res.send(`<h1> this is my homepage </h1>`);
})