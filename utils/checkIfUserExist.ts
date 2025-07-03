import { Users } from '../schemas/Users.js';

export async function checkIfUserExists(email: string) {
  return !!(await Users.findOne({ email }).select('_id').lean());
}
