import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      isAdmin?: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    isAdmin?: boolean
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user || !user.hashedPassword) return null

        const valid = await bcrypt.compare(credentials.password, user.hashedPassword)
        if (!valid) return null

        return { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin }
      }
    }),
    // Google OAuth provider - creates/links accounts via the Prisma adapter automatically.
    // Requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment.
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    })
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // include isAdmin in the JWT token
    async jwt({ token, user }) {
      try {
        if (user?.email) {
          // first time jwt callback after sign in
          const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
          if (dbUser) {
            token.isAdmin = dbUser.isAdmin ?? false
          }
        }
        return token
      } catch (err) {
        return token
      }
    },
    async session({ session, token }) {
      try {
        session.user = session.user ?? {}
        session.user.id = token.sub // JWT sub is the user id
        ;(session.user as { isAdmin?: boolean }).isAdmin = token.isAdmin ?? false
      } catch (err) {
        // ignore
      }
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
