import express from "express";
import { addUser } from "../controller/usersController.js";
const router = express.Router();
router.post("/add", async (req, res, next) => {
    try {
        await addUser(req, res);
    }
    catch (error) {
        next(error);
    }
});
export default router;
