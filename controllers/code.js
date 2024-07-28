const { GoogleGenerativeAI } = require("@google/generative-ai");

const { increaseApiLimit, checkApiLimit } = require('../services/api-limits');
const { checkSubscription } = require('../services/subscription');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const instructionMessage = {
    role: "system",
    content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations."
};

async function handleCodeGeneration(req, res) {
    try {
        const { userId } = req.auth;
        const { messages } = req.body;

        if (!userId) {
            return res.status(401).send("Unauthorized");
        }

        if (!messages) {
            return res.status(400).send("Messages are required");
        }

        const freeTrial = await checkApiLimit(userId);
        const isPremium = await checkSubscription(userId);

        if (!freeTrial && !isPremium) {
            return res.status(403).send("You have exceeded your API limit and free trial is expired");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const lastMessage = messages[messages.length - 1];
        const prompt = instructionMessage.content + " " + lastMessage.content;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (!isPremium) {
            await increaseApiLimit(userId);
        }

        return res.json(text);
    } catch (error) {
        console.log("[CODE_ERROR]", error);
        return res.status(500).send("Internal Error");
    }
}

module.exports = handleCodeGeneration;