const express = require("express")
const categoriesModel = require("../models/categoriesModel")
const categories = express.Router()

categories.get("/:userId", async (req, res)=>{
    const {userId} = req.params
    try {
        const foundCategories = await categoriesModel.find({userId})
        res.status(200).json(foundCategories)
    }
    catch(e){
        console.log(e)
        res.status(500).json({message: "Error at server-side."})
    }
})

categories.post("/", async (req, res)=>{
    const newCategory = req.body
    try{
        await categoriesModel.insertOne(newCategory)
        res.status(201).json({message: "Category Created!"})
    }
    catch(e){
        console.log(e)
        res.status(500).json({message: "Error at server-side."})
    }
})

categories.delete("/:categoryId", async (req, res)=>{
    const {categoryId} = req.params
    try{
        await categoriesModel.deleteOne({_id: categoryId})
        res.status(200).json({message: "Category Deleted!"})
    }
    catch(e){
        console.log(e)
        res.status(500).json({message: "Error at server-side."})
    }
})

module.exports = categories