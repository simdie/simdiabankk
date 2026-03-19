import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import * as speakeasy from "speakeasy";
import prisma from "@/lib/prisma";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
  totpCode: z.string().optional(),
});

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        totpCode: { label: "2FA Code", type: "text" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) throw new Error("Invalid input");

        const { email, password, totpCode } = parsed.data;

        // Try email first, then account number
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          // Try as account number
          const account = await prisma.account.findFirst({
            where: { accountNumber: email },
            include: { user: true },
          });
          if (account) user = account.user;
        }
        if (!user) throw new Error("Invalid email or password");

        // --- Status gate (checked BEFORE password) ---
        if (user.status === "DISABLED") {
          throw new Error(
            `ACCOUNT_BLOCKED::${
              user.restrictionMessage ||
              "Your account has been permanently disabled. Please contact support."
            }`
          );
        }
        if (user.status === "RESTRICTED") {
          throw new Error(
            `ACCOUNT_BLOCKED::${
              user.restrictionMessage ||
              "Your account has been restricted. Please contact support for assistance."
            }`
          );
        }
        if (user.status === "PENDING_ACTIVATION") {
          throw new Error(
            "ACCOUNT_BLOCKED::Your account awaits administrator approval. You will be notified by email once your account is activated."
          );
        }

        // --- Password verification ---
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) throw new Error("Invalid email or password");

        // --- 2FA verification ---
        if (user.twoFactorEnabled) {
          if (!totpCode) throw new Error("2FA_REQUIRED");
          if (!user.twoFactorSecret)
            throw new Error("2FA configuration error. Please contact support.");

          const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: "base32",
            token: totpCode,
            window: 1,
          });
          if (!verified) throw new Error("Invalid authenticator code");
        }

        // Audit log + login history
        const ipAddress = (credentials as any)?.ipAddress as string | undefined;
        const userAgent = (credentials as any)?.userAgent as string | undefined;
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "USER_LOGIN",
            details: { email: user.email },
            ipAddress: ipAddress || null,
          },
        });
        await prisma.loginHistory.create({
          data: {
            userId: user.id,
            status: "SUCCESS",
            ipAddress: ipAddress || null,
            userAgent: userAgent || null,
          },
        }).catch(() => {});

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      const prod = "https://www.boasiaonline.com";
      if (url.startsWith("/")) return `${prod}${url}`;
      if (url.startsWith(prod) || url.startsWith(baseUrl)) return url;
      return `${prod}/login`;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
