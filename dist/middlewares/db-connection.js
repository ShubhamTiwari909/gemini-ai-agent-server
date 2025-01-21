import connectDB from "../mongodb-connection.mjs";
export const connectionWrapper = async (_, res, next) => {
    const connection = await connectDB();
    if (connection) {
        next();
    }
    else {
        res.status(500).send("MongoDB Connection Failed!");
    }
};
