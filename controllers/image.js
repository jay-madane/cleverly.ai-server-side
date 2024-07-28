const Replicate = require("replicate");

const { increaseApiLimit, checkApiLimit } = require('../services/api-limits');
const { checkSubscription } = require('../services/subscription');
const splitResolution = require("../services/split-resolution");

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

async function handleImageGeneration(req, res) {
    try {
        const { userId } = req.auth;
        const { prompt, amount = 1, resolution = "512x512" } = req.body;

        if (!userId) {
            return res.status(401).send("Unauthorized");
        }

        if (!prompt) {
            return res.status(400).send("Prompt is required");
        }

        if (!resolution) {
            return res.status(400).send("Resolution is required");
        }

        const resolutionSplit = splitResolution(resolution);

        const freeTrial = await checkApiLimit(userId);
        const isPremium = await checkSubscription(userId);

        if (!freeTrial && !isPremium) {
            return res.status(403).send("You have exceeded your API limit and free trial is expired");
        }

        const response = await replicate.run(
            "bytedance/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f",
            {
                input: {
                    width: resolutionSplit.width,
                    height: resolutionSplit.height,
                    prompt: prompt,
                    scheduler: "K_EULER",
                    num_outputs: parseInt(amount, 10),
                    guidance_scale: 0,
                    negative_prompt: "worst quality, low quality",
                    num_inference_steps: 4
                }
            }
        );

        if (!isPremium) {
            await increaseApiLimit(userId);
        }

        return res.json(response);

    } catch (error) {
        console.log("[IMAGE_ERROR]", error);
        return res.status(500).send("Internal Error");
    }
};

module.exports = handleImageGeneration;