const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://sahilnexios:PvCNYoO1aT3q8Qx2@cluster0.zsraiar.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connection Succesfully")
}).catch((err) => {
    console.log("connection faield", err)
})