const mongoose = require("mongoose")

const expensesSchema = new mongoose.Schema({
    description: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    date: {
        type: Date,
        require: true
    },
    userId:{
        type: mongoose.Schema.ObjectId,
        require: true
    },
    categoryId: {
        type: mongoose.Schema.ObjectId,
        require: true
    }
})

const expensesModel = mongoose.model("expenses", expensesSchema, "expenses")

module.exports = expensesModel