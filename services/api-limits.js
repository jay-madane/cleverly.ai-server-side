const UserApiLimit = require("../models/UserApiLimit");

const MAX_FREE_COUNTS = 5;

async function checkApiLimit(userIdInput) {
    const userApiLimit = await UserApiLimit.findOne({ userId: userIdInput });

    if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
        return true;
    } else {
        return false;
    }
}

async function increaseApiLimit(userIdInput) {
    const userApiLimit = await UserApiLimit.findOne({ userId: userIdInput });

    if (userApiLimit) {
        userApiLimit.count += 1;
        await userApiLimit.save();
    } else {
        const newUserApiLimit = new UserApiLimit({ userId: userIdInput, count: 1 });
        await newUserApiLimit.save();
    }
}

module.exports = {
    checkApiLimit,
    increaseApiLimit,
};