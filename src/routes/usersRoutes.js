const express = require("express")
const usersModel = require("../models/usersModel")
const jwt = require("jsonwebtoken")
const users = express.Router()

users.get("/", (req, res)=>{
    res.send("GET from /users")
})

users.post("/login", async (req, res)=>{
    const {email, password} = req.body
    const foundUser = await usersModel.find({email, password}, {password: 0, email: 0})
    if(foundUser.length==0){
        res.status(404).send()
    }

    const userData = {
        id: foundUser[0]._id.toString(),
        name: foundUser[0].name
    }

    const token = jwt.sign(userData, "sagar@1997", {expiresIn: "15m"})
    res.status(200).json({token})
})

users.post("/", async (req, res)=>{
    const newUser = req.body
    try{
        await usersModel.insertOne(newUser)
        res.send("User Created Successfully")    
    }
    catch(e){
        console.log(e)
        res.send("Some error")
    }
})

module.exports = users