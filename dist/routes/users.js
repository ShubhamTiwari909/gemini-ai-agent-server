import express from "express";
import { addUser, getUserByEmail } from "../controller/usersController.js";
const router = express.Router();
router.post("/add", async (req, res, next) => {
    try {
        await addUser(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post("/find", async (req, res, next) => {
    try {
        await getUserByEmail(req, res);
    }
    catch (error) {
        next(error);
    }
});
export default router;
