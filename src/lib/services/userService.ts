import { prisma } from '@/lib/prisma';
import { User, HealthMetric, EmergencyContact } from '@prisma/client';
import bcrypt from 'bcryptjs';

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  role?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
  bloodType?: string;
  allergies?: string;
  medications?: string;
  medicalHistory?: string;
}

export interface UpdateUserData {
  name?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
  bloodType?: string;
  allergies?: string;
  medications?: string;
  medicalHistory?: string;
  location?: string;
  language?: string;
}

export class UserService {
  static async createUser(data: CreateUserData): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role || 'patient'
      }
    });
  }

  static async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        emergencyContacts: true,
        healthMetrics: {
          orderBy: { recordedAt: 'desc' },
          take: 10
        }
      }
    });
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  static async updateUser(id: string, data: UpdateUserData): Promise<User> {
    return prisma.user.update({
      where: { id },
      data
    });
  }

  static async deleteUser(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id }
    });
  }

  static async getUserProfile(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        emergencyContacts: {
          where: { isActive: true },
          orderBy: [{ isPrimary: 'desc' }, { name: 'asc' }]
        },
        healthMetrics: {
          orderBy: { recordedAt: 'desc' },
          take: 20
        },
        appointments: {
          include: {
            provider: {
              select: {
                name: true,
                specialty: true
              }
            }
          },
          orderBy: { dateTime: 'desc' },
          take: 10
        }
      }
    });

    if (!user) return null;

    // Parse JSON fields
    const parseJSONField = (field: string | null) => {
      if (!field) return null;
      try {
        return JSON.parse(field);
      } catch {
        return field;
      }
    };

    return {
      ...user,
      allergies: parseJSONField(user.allergies),
      medications: parseJSONField(user.medications),
      medicalHistory: parseJSONField(user.medicalHistory),
      emergencyContact: parseJSONField(user.emergencyContact)
    };
  }

  static async addHealthMetric(userId: string, metric: {
    type: string;
    value: number;
    unit: string;
    notes?: string;
    source?: string;
  }) {
    return prisma.healthMetric.create({
      data: {
        userId,
        type: metric.type as any,
        value: metric.value,
        unit: metric.unit,
        notes: metric.notes,
        source: metric.source || 'manual'
      }
    });
  }

  static async getHealthMetrics(userId: string, type?: string, limit = 50) {
    const where: any = { userId };
    if (type) where.type = type;

    return prisma.healthMetric.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      take: limit
    });
  }
}