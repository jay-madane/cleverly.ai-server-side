const Replicate = require("replicate");

const { increaseApiLimit, checkApiLimit } = require('../services/api-limits');
const { checkSubscription } = require('../services/subscription');

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

async function handleVideoGeneration(req, res) {
    try {
        const { userId } = req.auth;
        const { prompt } = req.body;

        if (!userId) {
            return res.status(401).send("Unauthorized");
        }

        if (!prompt) {
            return res.status(400).send("Prompt is required");
        }

        const freeTrial = await checkApiLimit(userId);
        const isPremium = await checkSubscription(userId);

        if (!freeTrial && !isPremium) {
            return res.status(403).send("You have exceeded your API limit and free trial is expired");
        }

        const response = await replicate.run(
            "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
            {
                input: {
                    prompt: prompt
                }
            }
        );

        if (!isPremium) {
            await increaseApiLimit(userId);
        }

        return res.json(response);

    } catch (error) {
        console.log("[VIDEO_ERROR]", error);
        return res.status(500).send("Internal Error");
    }
};

module.exports = handleVideoGeneration;