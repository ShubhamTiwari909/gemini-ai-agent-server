import { Request, Response } from "express";
import { Users } from "../mongodb-connection.js";

async function checkIfExists(email: string) {
  try {
    const exists = await Users.exists({ email });
    if (exists) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
  }
}

export const addUser = async (req: Request, res: Response) => {
  const { userId, name, email } = req.body;
  if (!userId || !name || !email)
    return res
      .status(400)
      .send("Bad Request - userId, name and email is required");

  if (await checkIfExists(email)) {
    return res.status(200).send("User already exists");
  }

  try {
    const newUser = new Users({ userId, name, email });
    const result = await newUser.save();
    res.status(201).send(`User saved - ${result}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
