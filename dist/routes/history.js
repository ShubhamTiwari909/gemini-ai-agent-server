import express from "express";
import { addHistory, getHistory } from "../controller/historyController.js";
const router = express.Router();
router.post("/add", (req, res, next) => {
    addHistory(req, res).catch(next);
});
router.post("/find", (req, res, next) => {
    getHistory(req, res).catch(next);
});
export default router;
