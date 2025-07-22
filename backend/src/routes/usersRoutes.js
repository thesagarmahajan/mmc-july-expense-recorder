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

    const token = jwt.sign(userData, "sagar@1997", {expiresIn: "1h"}) // Increased expiry to 1 hour
    res.status(200).json({token})
})

users.post("/", async (req, res)=>{
    const newUser = req.body
    try{
        const createdUser = await usersModel.create(newUser) // Use .create() to get the created document
        const userData = {
            id: createdUser._id.toString(),
            name: createdUser.name || createdUser.username // Assuming 'name' or 'username' exists for the token payload
        }
        const token = jwt.sign(userData, "sagar@1997", {expiresIn: "1h"}) // Increased expiry to 1 hour
        res.status(200).json({token})
    }
    catch(e){
        console.log(e)
        if (e.name === 'ValidationError') {
            const errors = {};
            for (const field in e.errors) {
                errors[field] = e.errors[field].message;
            }
            return res.status(400).json({ message: 'Validation failed', errors });
        }
        res.status(500).send("Some error occurred");
    }
})

module.exports = users