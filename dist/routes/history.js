import express from "express";
import { addHistory, getHistory } from "../controller/historyController.js";
import { dynamicLimiter } from "../middlewares/rate-limiting.js";
const router = express.Router();
router.post("/add", dynamicLimiter(60), (req, res, next) => {
    addHistory(req, res).catch(next);
});
router.post("/find", dynamicLimiter(120), (req, res, next) => {
    getHistory(req, res).catch(next);
});
export default router;
