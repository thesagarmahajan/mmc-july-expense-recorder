const mongoose = require("mongoose")

const expensesViewSchema = new mongoose.Schema({
    description: {
        type: String
    },
    amount: {
        type: Number
    },
    date: {
        type: Date
    },
    userId: {
        type: mongoose.Schema.ObjectId
    },
    categoryId: {
        type:mongoose.Schema.ObjectId
    },
    categoryTitle: {
        type: String
    }
})

const expensesViewModel = mongoose.model("expensesViewModel", expensesViewSchema, "expensesViewModel")
module.exports = expensesViewModel