import express from "express";
import { addHistory, getHistory } from "../controller/historyController.js";
const router = express.Router();
router.post("/add", async (req, res, next) => {
    try {
        await addHistory(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post("/find", async (req, res, next) => {
    try {
        await getHistory(req, res);
    }
    catch (error) {
        next(error);
    }
});
export default router;
