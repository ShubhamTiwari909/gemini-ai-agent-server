import { Users } from "../schemas/Users.js";
import { encrypt } from "../utils/hybrid-encryption.js";
async function checkIfExists(userId) {
    return !!(await Users.findOne({ userId }).select("_id").lean());
}
export const getUserByEmail = async (req, res) => {
    const { email, userId } = req.body;
    if (!email || !userId)
        return res.status(400).json({ message: "Bad Request - email and user id is required" });
    try {
        const user = await Users.findOne({ email, userId });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const addUser = async (req, res) => {
    const { userId, name, email, image } = req.body;
    if (!userId || !name || !email || !image)
        return res
            .status(400)
            .json({ message: "Bad Request - userId, name and email is required" });
    if (await checkIfExists(userId)) {
        return res.status(200).json({ message: "User already exists" });
    }
    try {
        const newUser = new Users({ userId, name, email, image });
        const result = await newUser.save();
        res.status(201).json(`User saved - ${result}`);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const getUserId = async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ message: "Bad Request - email and user id is required" });
    try {
        const user = await Users.findOne({ email }, { userId: 1 });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const encryptedUserId = encrypt(user.userId);
        res.status(200).json({
            uid: encryptedUserId
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
