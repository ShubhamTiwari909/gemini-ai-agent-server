import express from "express";
const router = express.Router();
router.post("/add", async (req, res, next) => {
    res.send("User added");
    // try {
    //   await addUser(req, res);
    // } catch (error) {
    //   next(error);
    // }
});
export default router;
