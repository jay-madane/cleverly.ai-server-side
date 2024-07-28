const mongoose = require('mongoose');

const userSubscriptionSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true,
    },
    stripeCustomerId: {
        type: String,
        unique: true,
        sparse: true,
    },
    stripeSubscriptionId: {
        type: String,
        unique: true,
        sparse: true,
    },
    stripePriceId: {
        type: String,
        sparse: true,
    },
    stripeCurrentPeriodEnd: {
        type: Date,
        sparse: true,
    },
});

const UserSubscription = mongoose.model('userSubscription', userSubscriptionSchema);

module.exports = UserSubscription;