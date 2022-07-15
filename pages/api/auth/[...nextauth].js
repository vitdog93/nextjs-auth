import NextAuth from "next-auth";
import Providers from "next-auth/providers";

import { connectToDatabase } from "../../../lib/db";
import { verifyPassword } from "../../../lib/auth";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const client = await connectToDatabase();
        const db = client.db("next_auth");
        const collection = db.collection("users");

        const user = await collection.findOne({ email: credentials.email });
        
        if (!user) {
          throw new Error("No user found!");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Could not log you in!");
        }

        client.close();
        return {
          email: user.email,
        };
      },
    }),
  ],
});
