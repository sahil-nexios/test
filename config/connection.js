const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/node").then(() => {
    console.log("connection Succesfully")
}).catch((err) => {
    console.log("connection faield", err)
})