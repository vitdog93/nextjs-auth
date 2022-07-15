import { connectToDatabase } from "../../../lib/db";
import { hashPassword } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 7
    )
      return res.status(422).json({
        message:
          "Invalid input - password should be also at least 7 characters long.",
      });
    try {
      const client = await connectToDatabase();
      const db = client.db("next_auth");
      const collection = db.collection("users");

      const existingUser = await collection.findOne({ email });
      if (existingUser)
        return res.status(422).json({ message: "User already exist!" });

      const hashedPassword = await hashPassword(password);
      const newUser = { email, password: hashedPassword };
      const result = await collection.insertOne(newUser);
      newUser.id = result.insertedId;
      return res
        .status(201)
        .json({ message: "Sign up success", user: newUser });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
