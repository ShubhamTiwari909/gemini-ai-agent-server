import express from "express";
import { dynamicLimiter } from "../middlewares/rate-limiting.js";
import { getFeed } from "../controller/feedController.js";
const router = express.Router();
router.post("/", dynamicLimiter(120), async (req, res, next) => {
    try {
        await getFeed(req, res);
    }
    catch (error) {
        next(error);
    }
});
export default router;
