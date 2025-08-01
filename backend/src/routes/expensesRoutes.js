const express = require("express")
const expensesViewModel = require("../models/expensesViewModel")
const expensesModel = require("../models/expensesModel")
const authMiddleware = require("../middlewares/authMiddleware")
const categoriesModel = require("../models/categoriesModel")
const expenses = express.Router()

// Last 10 Expenses
expenses.get("/", authMiddleware, async (req, res)=>{
    const {id} = req.tokenData
    // Use that userId with the find() method
    const foundExpenses = await expensesViewModel.find({userId: id}).sort({date: -1}).limit(10)
    res.send(foundExpenses)
})

expenses.post("/", authMiddleware, async (req, res)=>{
    try {
        const { description, amount, date, categoryId } = req.body; // Changed from categoryTitle
        const { id: userId } = req.tokenData;
        if (!categoryId) {
            return res.status(400).json({ message: "Category ID is required." }); // Changed message
        }
        // Check if category exists for this user
        let category = await categoriesModel.findOne({ _id: categoryId, userId }); // Changed to _id
        if (!category) {
            return res.status(404).json({ message: "Category not found." }); // If category doesn't exist, return error
        }
        // Create the expense
        await expensesModel.create({
            description,
            amount,
            date,
            userId,
            categoryId: category._id
        });
        res.status(201).json({message: "Expense Created!"});
    }
    catch(e){
        console.log(e)
        res.status(500).json({message: "Error at server-side."})
    }
})

expenses.get("/:from/:to/:categoryId", async (req, res)=>{
    const {from, to, categoryId} = req.params // {from: "", to: "", categoryId: ""}
    let foundExpenses = []
    if(categoryId=="all"){
        foundExpenses = await expensesViewModel.find({
            date: {
                $gte: new Date(from),
                $lte: new Date(to)
            }
        })
    }
    else{
        foundExpenses = await expensesViewModel.find({
            date: {
                $gte: new Date(from),
                $lte: new Date(to)
            },
            categoryId: categoryId
        })    
    }
    res.send(foundExpenses)
})

expenses.delete("/:expenseId", async (req, res)=>{
    const {expenseId} = req.params
    try {
        await expensesModel.deleteOne({_id: expenseId})
        res.status(200).json({message: "Expense Deleted!"})
    }
    catch(e){
        console.log(e)
        res.status(500).json({message: "Error at server-side."})
    }
    
})

module.exports = expenses