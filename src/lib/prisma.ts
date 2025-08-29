import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// For serverless environments, create prisma client with error handling
function createPrismaClient() {
  // In serverless/Netlify environment, disable database for now
  if (process.env.NETLIFY || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('file:')) {
    console.warn('Running in serverless environment without database - using mock mode')
    return null
  }
  
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  } catch (error) {
    console.warn('Prisma client creation failed, using mock client:', error)
    return null
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Mock database functions for serverless demo
export const mockUser = {
  id: '1',
  email: 'demo@healthtriage.ai',
  name: 'Demo User',
  password: '$2b$10$wxbPG.EYk.w86ih6CpY0bexywkuCwjXZMPcpCC4UVsHhbOge6eQGe', // demo123
  role: 'PATIENT' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma