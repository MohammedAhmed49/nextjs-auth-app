import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { verifyPassword } from "../../../lib/auth";
import { connectToDB } from "../../../lib/db";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const client = await connectToDB();

        const usersCollection = client.db("auth").collection("users");

        const user = await usersCollection.findOne({
          email: credentials.email,
        });
        console.log(user);

        if (!user) {
          client.close();
          throw new Error("User is not found");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error("Wrong username or password");
        }

        client.close();
        return { email: user.email };
      },
    }),
  ],
});
