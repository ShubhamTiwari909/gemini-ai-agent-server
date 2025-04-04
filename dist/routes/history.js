import express from "express";
import { addHistory, getHistory, getHistoryById, updateLikes } from "../controller/historyController.js";
import { dynamicLimiter } from "../middlewares/rate-limiting.js";
const router = express.Router();
router.post("/add", dynamicLimiter(60), async (req, res, next) => {
    try {
        await addHistory(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post("/find", dynamicLimiter(120), async (req, res, next) => {
    try {
        await getHistory(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post("/findById", dynamicLimiter(120), async (req, res, next) => {
    try {
        await getHistoryById(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post("/updateLikes", dynamicLimiter(120), async (req, res, next) => {
    try {
        await updateLikes(req, res);
    }
    catch (error) {
        next(error);
    }
});
export default router;
