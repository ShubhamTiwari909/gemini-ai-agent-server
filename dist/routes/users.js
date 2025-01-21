import express from "express";
import { addUser } from "../controller/usersController.js";
const router = express.Router();
router.post("/add", (req, res, next) => {
    addUser(req, res).catch(next);
});
export default router;
