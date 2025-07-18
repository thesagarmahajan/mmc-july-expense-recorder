const mongoose = require("mongoose")
const usersSchema = new mongoose.Schema({
    name : {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
})

const usersModel = mongoose.model("users", usersSchema, "users")
module.exports = usersModel