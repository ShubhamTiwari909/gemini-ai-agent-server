import { History } from "../mongodb-connection.mjs";

export const getHistory = async (req, res) => {
  const { userId } = req.body;
  const history = await History.find({ userId: String(userId) });
  res.send(history);
};

export const addHistory = async (req, res) => {
  const { userId, prompt, response } = req.body;
  const newHistory = new History({ userId, prompt, response });
  const result = await newHistory.save();
  res.send(`History saved - ${result}`);
};
