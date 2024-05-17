const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL, {
}).then(() => {
    console.log("Connection Successfully")
}).catch((err) => {
    console.log("connection faield", err)
})