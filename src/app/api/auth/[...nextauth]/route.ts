import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// Mock user database - in production, this would be replaced with actual database queries
const users = [
  {
    id: '1',
    email: 'demo@healthtriage.ai',
    name: 'Demo User',
    password: '$2b$10$wxbPG.EYk.w86ih6CpY0bexywkuCwjXZMPcpCC4UVsHhbOge6eQGe', // 'demo123'
    role: 'patient',
    emailVerified: true,
    profile: {
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1990-01-15',
      gender: 'other',
      address: '123 Demo St, San Francisco, CA 94102'
    }
  },
  {
    id: '2',
    email: 'doctor@healthtriage.ai',
    name: 'Dr. Sarah Johnson',
    password: '$2b$10$71RmQJy8qLUAEZhGBdQPdeRLSOr1Kehkq.KloCsL4b42YzLtKFYAO', // 'doctor123'
    role: 'provider',
    emailVerified: true,
    profile: {
      specialty: 'Family Medicine',
      license: 'CA123456789',
      phone: '+1 (555) 987-6543'
    }
  }
];

export const authOptions: NextAuthOptions = {
  adapter: prisma ? PrismaAdapter(prisma) : undefined,
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          let user;
          
          // Check if we're in serverless/mock mode
          if (!prisma) {
            // Use mock users directly in serverless environment
            user = users.find(u => u.email === credentials.email);
            if (!user) {
              throw new Error('No user found with this email');
            }
          } else {
            // First, try to find user in database
            user = await prisma.user.findUnique({
              where: { email: credentials.email }
            });

            // If user doesn't exist, check mock users and create them
            if (!user) {
              const mockUser = users.find(u => u.email === credentials.email);
              if (mockUser) {
                user = await prisma.user.create({
                  data: {
                    email: mockUser.email,
                    name: mockUser.name,
                    password: mockUser.password,
                    role: mockUser.role
                  }
                });
              }
            }
          }
          
          if (!user || !user.password) {
            throw new Error('No user found with this email');
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error('Authentication failed');
        }
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.profile = (user as any).profile;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).profile = token.profile;
      }
      return session;
    },
    
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error'
  },
  
  // Use JWT strategy in serverless environments, database strategy otherwise
  session: {
    strategy: prisma ? 'database' : 'jwt',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  },
  
  jwt: {
    maxAge: 7 * 24 * 60 * 60 // 7 days
  },
  
  secret: process.env.NEXTAUTH_SECRET || 'healthcare-platform-secret-key-change-in-production'
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };