const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Gold', 'Platinum', 'Silver'],
        required: true,
    },
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
    user: { type: mongoose.Schema.Types.ObjectId },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
