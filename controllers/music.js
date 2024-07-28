const Replicate = require("replicate");

const { increaseApiLimit, checkApiLimit } = require('../services/api-limits');
const { checkSubscription } = require('../services/subscription');

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

async function handleMusicGeneration(req, res) {
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
            "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
            {
                input: {
                    prompt_a: prompt
                }
            }
        );

        if (!isPremium) {
            await increaseApiLimit(userId);
        }

        return res.json(response);

    } catch (error) {
        console.log("[MUSIC_ERROR]", error);
        return res.status(500).send("Internal Error");
    }
};

module.exports = handleMusicGeneration;