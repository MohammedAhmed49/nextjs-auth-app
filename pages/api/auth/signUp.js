import { hashPassword } from "../../../lib/auth";
import { connectToDB } from "../../../lib/db";

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    const { email, password } = data;

    console.log(email, password);

    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 7
    ) {
      res.status(422).json({ message: "Invalid input!" });
    }

    console.log("client");

    const client = await connectToDB();

    const db = client.db("auth");

    const findUser = await db.collection("users").findOne({ email: email });

    if (findUser) {
      res.status(422).json({ message: "User already exists!" });

      client.close();

      return;
    }

    const hashedPassword = await hashPassword(password);

    const result = await db.collection("users").insertOne({
      email: email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User created successfully!" });

    client.close();
  }
}

export default handler;
