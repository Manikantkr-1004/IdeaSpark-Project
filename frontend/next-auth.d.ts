// next-auth.d.ts (root directory)
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    accessToken: string;  // ✅ Your custom field
  }

  interface Session {
    user: {
      accessToken: string;  // ✅ Available in session.user
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;  // ✅ Available in JWT token
  }
}
