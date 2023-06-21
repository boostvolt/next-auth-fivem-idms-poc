import NextAuth from "next-auth";

export default NextAuth({
  providers: [
    {
      id: "FiveM",
      name: "FiveM",
      type: "oauth",
      wellKnown: "https://idms.fivem.net/.well-known/openid-configuration",
      authorization: {
        params: { scope: "openid email identify" },
      },
      clientId: "txadmin_test",
      clientSecret: "txadmin_test",
      async profile(profile, token) {
        const response = await fetch(
          "https://idms.fivem.net/connect/userinfo",
          {
            headers: {
              Authorization: `Bearer ${token.access_token}`,
            },
          }
        );
        const data = await response.json();
        return {
          id: data.sub,
          name: data.name,
          email: data.email,
          image: data.picture,
        };
      },
    },
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token, user }) {
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      return token;
    },
  },
});
