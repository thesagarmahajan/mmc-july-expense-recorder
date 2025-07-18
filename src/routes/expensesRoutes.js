const express = require("express")
const expensesViewModel = require("../models/expensesViewModel")
const expensesModel = require("../models/expensesModel")
const authMiddleware = require("../middlewares/authMiddleware")
const expenses = express.Router()

// Last 10 Expenses
expenses.get("/", authMiddleware, async (req, res)=>{
    const {id} = req.tokenData
    // Use that userId with the find() method
    const foundExpenses = await expensesViewModel.find({userId: id}).sort({date: -1}).limit(10)
    res.send(foundExpenses)
})

expenses.post("/", async (req, res)=>{
    const newExpense = req.body
    try {
        await expensesModel.insertOne(newExpense)
        res.status(201).json({message: "Expense Created!"})
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