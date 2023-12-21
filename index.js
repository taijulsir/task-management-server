const express = require("express");
const app = express()
require("dotenv").config();
const cors = require("cors")
const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())

app.get('/',async(req,res)=>{
    res.send("The task management server is running")
})
app.listen(port,()=>{
    console.log(`The server is running on ${port} port`)
})