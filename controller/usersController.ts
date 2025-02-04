import { Request, Response } from "express";
import { Users } from "../schemas/Users.js";

async function checkIfExists(email: string) {
  return !!(await Users.findOne({ email }).select("_id").lean());
}

export const getUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).send("Bad Request - email is required");

  try {
    const user = await Users.findOne({ email });
    if (!user) return res.status(404).send("User not found");
    res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export const addUser = async (req: Request, res: Response) => {
  const { userId, name, email, image } = req.body;
  console.log("Image - ", image);
  if (!userId || !name || !email || !image)
    return res
      .status(400)
      .send("Bad Request - userId, name and email is required");

  if (await checkIfExists(email)) {
    return res.status(200).send("User already exists");
  }

  try {
    const newUser = new Users({ userId, name, email, image });
    const result = await newUser.save();
    res.status(201).send(`User saved - ${result}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
