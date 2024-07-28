const UserSubscription = require("../models/UserSubscription");

const DAY_IN_MS = 86_400_000;

async function checkSubscription(userIdInput) {
    const userSubscription = await UserSubscription.findOne({ userId: userIdInput })
        .select('stripeSubscriptionId stripeCurrentPeriodEnd stripeCustomerId stripePriceId')
        .exec();

    if (!userSubscription) {
        return false;
    }

    const isValid = userSubscription.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now();

    return !!isValid;
}


module.exports = {
    checkSubscription
};