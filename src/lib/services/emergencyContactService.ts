import { prisma } from '@/lib/prisma';
import { EmergencyContact } from '@prisma/client';

export interface CreateEmergencyContactData {
  userId: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  isPrimary?: boolean;
}

export interface UpdateEmergencyContactData {
  name?: string;
  relationship?: string;
  phone?: string;
  email?: string;
  address?: string;
  isPrimary?: boolean;
  isActive?: boolean;
}

export class EmergencyContactService {
  static async createEmergencyContact(data: CreateEmergencyContactData): Promise<EmergencyContact> {
    // If this contact is being set as primary, unset other primary contacts
    if (data.isPrimary) {
      await prisma.emergencyContact.updateMany({
        where: {
          userId: data.userId,
          isPrimary: true,
          isActive: true
        },
        data: { isPrimary: false }
      });
    }

    return prisma.emergencyContact.create({
      data
    });
  }

  static async getEmergencyContactById(id: string): Promise<EmergencyContact | null> {
    return prisma.emergencyContact.findUnique({
      where: { id }
    });
  }

  static async getUserEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
    return prisma.emergencyContact.findMany({
      where: {
        userId,
        isActive: true
      },
      orderBy: [
        { isPrimary: 'desc' },
        { name: 'asc' }
      ]
    });
  }

  static async updateEmergencyContact(id: string, data: UpdateEmergencyContactData): Promise<EmergencyContact> {
    const contact = await prisma.emergencyContact.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!contact) {
      throw new Error('Emergency contact not found');
    }

    // If this contact is being set as primary, unset other primary contacts
    if (data.isPrimary) {
      await prisma.emergencyContact.updateMany({
        where: {
          userId: contact.userId,
          isPrimary: true,
          isActive: true,
          id: { not: id }
        },
        data: { isPrimary: false }
      });
    }

    return prisma.emergencyContact.update({
      where: { id },
      data
    });
  }

  static async deleteEmergencyContact(id: string): Promise<EmergencyContact> {
    return prisma.emergencyContact.update({
      where: { id },
      data: { isActive: false }
    });
  }

  static async getPrimaryEmergencyContact(userId: string): Promise<EmergencyContact | null> {
    return prisma.emergencyContact.findFirst({
      where: {
        userId,
        isPrimary: true,
        isActive: true
      }
    });
  }

  static async seedMockEmergencyContacts(userId: string) {
    const mockContacts = [
      {
        userId,
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1 (555) 123-4567',
        email: 'jane.doe@email.com',
        address: '123 Demo St, San Francisco, CA 94102',
        isPrimary: true
      },
      {
        userId,
        name: 'John Smith',
        relationship: 'Brother',
        phone: '+1 (555) 987-6543',
        email: 'john.smith@email.com',
        isPrimary: false
      }
    ];

    // Check if user already has emergency contacts
    const existingContacts = await prisma.emergencyContact.findMany({
      where: { userId }
    });

    if (existingContacts.length === 0) {
      for (const contact of mockContacts) {
        await prisma.emergencyContact.create({
          data: contact
        });
      }
    }
  }

  static async getEmergencyContactsForAlert(userId: string): Promise<EmergencyContact[]> {
    // Get all active emergency contacts, prioritizing primary contacts
    return prisma.emergencyContact.findMany({
      where: {
        userId,
        isActive: true
      },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'asc' }
      ]
    });
  }
}