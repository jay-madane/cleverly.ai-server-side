const UserApiLimit = require("../models/UserApiLimit");

async function getApiLimitCount(req, res) {
    const { userId } = req.auth;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }
    try {
        const userApiLimit = await UserApiLimit.findOne({ userId: userId });

        if (!userApiLimit) {
            return res.json({ count: 0 });
        }

        return res.json({ count: userApiLimit.count });
    } catch (error) {
        console.error('Error fetching API limit count:', error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = getApiLimitCount;