const { clerkClient } = require("@clerk/clerk-sdk-node");

const stripe = require("../services/stripe");
const absoluteUrl = require("../services/utils");
const UserSubscription = require("../models/UserSubscription");

const settingsUrl = absoluteUrl("/settings");

async function handleStripe(req, res) {
    try {
        const { userId } = req.auth;
        const user = await clerkClient.users.getUser(userId);

        if (!userId || !user) {
            return res.status(401).send("Unauthorized");
        }

        const userSubscription = await UserSubscription.findOne({ userId });

        if (userSubscription && userSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsUrl,
            });
            return res.json({ url: stripeSession.url });
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "cleverly.ai Premium",
                            description: `Access to all cleverly.ai features including unlimited submissions for a month`,
                        },
                        unit_amount: 80000,
                        recurring: {
                            interval: "month"
                        }
                    },
                    quantity: 1,
                }
            ],
            metadata: {
                userId,
            },
        });

        return res.json({ url: stripeSession.url });

    } catch (error) {
        console.log("[STRIPE_ERROR]", error);
        return res.status(500).send("Internal Error");
    }
}

module.exports = handleStripe;

// 4000003560000008