import { hash } from "bcryptjs";

export async function hashPassword(password) {
  const hashedPass = await hash(password, 12);

  return hashedPass;
}
