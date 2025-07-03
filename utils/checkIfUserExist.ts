import { Users } from "../schemas/Users.js";

export async function checkIfUserExists(userId: string) {
  return !!(await Users.findOne({ userId }).select('_id').lean());
}