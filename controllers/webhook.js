const stripe = require("../services/stripe");
const UserSubscription = require("../models/UserSubscription");

async function handleWebhook(req, res) {
    const body = req.body;
    const signature = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        return res.status(400).send(`⚠️ Webhook Error: ${error.message}`);
    }

    const session = event.data.object;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription
        );

        if (!session?.metadata?.userId) {
            return res.status(400).send("User id is required");
        }

        await UserSubscription.create({
            userId: session?.metadata?.userId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
            ),
        });
    }

    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription
        );

        await UserSubscription.findOneAndUpdate(
            { stripeSubscriptionId: subscription.id },
            {
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                ),
            },
            { new: true, upsert: false }
        );
    }

    return res.status(200).send(null);
};

module.exports = handleWebhook;