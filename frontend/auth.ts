// auth.ts (root level)
import NextAuth, { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { OAuth2Client } from 'google-auth-library'
import axios from "axios"

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    // ✅ NEW: Google One Tap (separate provider)
    Credentials({
      id: "google-one-tap",
      async authorize(credentials) {
        try {
          const token = credentials.credential as string;

          // ✅ Official Google Library (handles FedCM)
          const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
          const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID  // Your client ID
          });

          const payload = ticket.getPayload();
          if (!payload) return null;

          // ✅ payload = { sub, email, name, picture }
          const response = await axios.post(`${process.env.BACKEND_URL}/user/socialogin`, {
            email: payload.email,
            name: payload.name,
            image: payload.picture,
            provider: "google",
          });

          return {
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            image: payload.picture,
            accessToken: response.data.data.accessToken
          };
        } catch (error) {
          console.log('One Tap verify error:', error);
          return null;
        }
      }
    }),

    Credentials({
      async authorize(credentials) {
        // my backend login API call
        try {
          const response = await axios.post(`${process.env.BACKEND_URL}/user/login`, {
            email: credentials.email,
            password: credentials.password
          });
          return response.data.data;
        } catch (error: any) {
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/account/login",  // custom sign-in page
  },
  callbacks: {
    async jwt({ token, user, account }) { // this is for populating token

      if (user) {

        const response = await axios.post(`${process.env.BACKEND_URL}/user/socialogin`, {
          email: user.email,
          name: user.name,
          image: user.image,
          provider: account?.provider,  // "google" or "github"
        });
        const accessToken = response.data.data.accessToken;
        token.id = user.id;
        token.accessToken = accessToken;
        return token;
      }
      return token;

    },
    session({ session, token }) { // this is for populating session

      session.user.id = token.sub as string // custom ids field
      session.user.accessToken = token.accessToken as string
      return session
    },
    async redirect({ url, baseUrl }) {
      // 1. Check if the URL contains a 'redirectTo' or 'callbackUrl' parameter
      const parsedUrl = new URL(url, baseUrl);
      const redirectTo = parsedUrl.searchParams.get("redirectTo");

      // 2. If a specific path exists, prioritize it
      if (redirectTo) {
        // Ensure it's a relative path to prevent open-redirect attacks
        return redirectTo.startsWith("/")
          ? `${baseUrl}${redirectTo}`
          : redirectTo;
      }

      // 3. Fallback logic: Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // 4. Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;

      // Default to home
      return baseUrl;
    }
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
