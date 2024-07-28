const UserSubscription = require("../models/UserSubscription");

const DAY_IN_MS = 86_400_000;

async function checkSubscription(req, res) {
    const { userId } = req.auth;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }
    try {
        const userSubscription = await UserSubscription.findOne({ userId: userId })
            .select('stripeSubscriptionId stripeCurrentPeriodEnd stripeCustomerId stripePriceId')
            .exec();

        if (!userSubscription) {
            return res.json({ isValid: false });
        }

        const isValid = userSubscription.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now();

        return res.json({ isValid: !!isValid });
    } catch (error) {
        console.error('Error checking subscription:', error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = checkSubscription;