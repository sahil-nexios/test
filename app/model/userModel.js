const { default: mongoose } = require("mongoose")

const newScema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    plan: [{ type: mongoose.Schema.Types.ObjectId }]
})


module.exports = mongoose.model('user', newScema)