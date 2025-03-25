import express from "express";
import { dynamicLimiter } from "../middlewares/rate-limiting.js";
import { getFeed, getFeedBySearch, getFeedByTags } from "../controller/feedController.js";
const router = express.Router();
router.post("/", dynamicLimiter(120), async (req, res, next) => {
    try {
        await getFeed(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post("/search", dynamicLimiter(120), async (req, res, next) => {
    try {
        await getFeedBySearch(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post("/search/tags", dynamicLimiter(120), async (req, res, next) => {
    try {
        await getFeedByTags(req, res);
    }
    catch (error) {
        next(error);
    }
});
export default router;
