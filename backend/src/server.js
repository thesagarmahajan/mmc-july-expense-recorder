const express = require("express")
const app = express()
const mongoose = require("mongoose")
const usersRoute = require("./routes/usersRoutes")
const categoriesRoute = require("./routes/categoriesRoutes")
const expensesRoute = require("./routes/expensesRoutes")
const cors = require("cors");

const PORT = 8888

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/expenseRecorder")
.then((con)=>console.log("Connection Successful"))


app.use("/users", usersRoute)
app.use("/categories", categoriesRoute)
app.use("/expenses", expensesRoute)

app.get("/", (req, res)=>{
    res.send("Hello from Expense Recorder")
})

app.listen(PORT, ()=>{
    console.log(`HTTP Server listening on http://localhost:${PORT}`)
})