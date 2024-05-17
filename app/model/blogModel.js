const { default: mongoose, Model } = require("mongoose")

const newScema = new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    auther_id: { type: mongoose.Schema.Types.ObjectId },
    category: { type: String },
    image: { type: String }
}, { timestamps: true })


module.exports = mongoose.model('blog', newScema)