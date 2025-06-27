import express from "express";
import { addUser, getUserByEmail, getUserById, getUserId } from "../controller/usersController.js";
import { dynamicLimiter } from "../middlewares/rate-limiting.js";
const router = express.Router();
router.post("/add", dynamicLimiter(1), async (req, res, next) => {
    try {
        await addUser(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post("/findIdByEmail", async (req, res, next) => {
    try {
        await getUserId(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post("/findById", async (req, res, next) => {
    try {
        await getUserById(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post("/findUserByEmail", async (req, res, next) => {
    try {
        await getUserByEmail(req, res);
    }
    catch (error) {
        next(error);
    }
});
export default router;
