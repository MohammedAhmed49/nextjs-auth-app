import { getSession } from "next-auth/client";
import { hashPassword, verifyPassword } from "../../../lib/auth";
import { connectToDB } from "../../../lib/db";

async function handler(req, res) {
  if (req.method !== "PATCH") return;

  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: "Not authentication!" });
    return;
  }

  const { oldPassword, newPassword } = req.body;
  const email = session.user.email;

  const client = await connectToDB();
  const collection = client.db("auth").collection("users");

  const user = await collection.findOne({ email });

  if (!user) {
    res.status(404).json({ message: "User not found!" });
    client.close();
    return;
  }

  const isValid = await verifyPassword(oldPassword, user.password);

  if (!isValid) {
    res.status(403).json({ message: "Wrong password" });
    client.close();
    return;
  }

  console.log(oldPassword, newPassword, email);

  const hashedPassword = await hashPassword(newPassword);

  const result = await collection.updateOne(
    { email },
    { $set: { password: hashedPassword } }
  );

  res.status(200).json({ message: "Password updated!", result });

  client.close();
}

export default handler;
