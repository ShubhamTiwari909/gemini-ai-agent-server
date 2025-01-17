import { History } from "../mongodb-connection.mjs";

export const getHistory = async (req, res) => {
  const { email } = req.body;
  const history = await History.find({ email: String(email) });
  res.send(history);
};

export const addHistory = async (req, res) => {
  const { historyId, email, prompt, response } = req.body;
  const newHistory = new History({ historyId, email, prompt, response });
  const result = await newHistory.save();
  res.send(`History saved - ${result}`);
};
