import { Users } from "../mongodb-connection";
async function checkIfExists(email) {
    return !!(await Users.findOne({ email }).select('_id').lean());
}
export const addUser = async (req, res) => {
    const { userId, name, email } = req.body;
    if (!userId || !name || !email) {
        return res.status(400).send("Bad Request - userId, name and email is required");
    }
    try {
        const userExists = await checkIfExists(email);
        if (userExists) {
            return res.status(200).send("User already exists");
        }
        const newUser = new Users({ userId, name, email });
        const result = await newUser.save();
        res.status(201).send(`User saved - ${result}`);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};
