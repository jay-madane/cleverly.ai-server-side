const { Router } = require("express");

const handleConversationGeneration = require("../controllers/conversation");
const handleCodeGeneration = require("../controllers/code");
const handleMusicGeneration = require("../controllers/music");
const handleVideoGeneration = require("../controllers/video");
const handleImageGeneration = require("../controllers/image");
const handleStripe = require("../controllers/stripe");
const handleWebhook = require("../controllers/webhook");
const getApiLimitCount = require("../controllers/get-api-limits");
const checkSubscription = require("../controllers/subscription");

const router = Router();

router.post("/code", handleCodeGeneration);
router.post("/conversation", handleConversationGeneration);
router.post("/music", handleMusicGeneration);
router.post("/video", handleVideoGeneration);
router.post("/image", handleImageGeneration);
router.post("/webhook", handleWebhook);

router.get("/stripe", handleStripe);
router.get("/get-api-limit-count", getApiLimitCount);
router.get("/check-subscription", checkSubscription);

module.exports = router;