const mongoose = require("mongoose")

const categoriesSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        require: true
    }
})

const categoriesModel = mongoose.model("categories", categoriesSchema, "categories")
module.exports = categoriesModel