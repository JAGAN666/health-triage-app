import { prisma } from '@/lib/prisma';
import { Provider, Appointment } from '@prisma/client';

export interface CreateProviderData {
  name: string;
  specialty: string;
  experience: number;
  languages: string[];
  availability: any;
  hourlyRate?: number;
  bio?: string;
  education?: string[];
  certifications?: string[];
}

export interface ProviderSearchFilters {
  specialty?: string;
  language?: string;
  availability?: string;
  minRating?: number;
  maxRate?: number;
}

export class ProviderService {
  static async createProvider(data: CreateProviderData): Promise<Provider> {
    return prisma.provider.create({
      data: {
        ...data,
        languages: JSON.stringify(data.languages),
        availability: JSON.stringify(data.availability),
        education: data.education ? JSON.stringify(data.education) : null,
        certifications: data.certifications ? JSON.stringify(data.certifications) : null
      }
    });
  }

  static async seedMockProviders() {
    const mockProviders = [
      {
        name: 'Dr. Sarah Johnson',
        specialty: 'Family Medicine',
        rating: 4.8,
        reviewCount: 127,
        experience: 12,
        languages: ['English', 'Spanish'],
        availability: {
          monday: ['09:00', '17:00'],
          tuesday: ['09:00', '17:00'],
          wednesday: ['09:00', '17:00'],
          thursday: ['09:00', '17:00'],
          friday: ['09:00', '15:00']
        },
        hourlyRate: 200,
        bio: 'Board-certified family physician with over 12 years of experience providing comprehensive healthcare.',
        education: ['MD - University of California, San Francisco', 'Residency - Stanford Family Medicine'],
        certifications: ['Board Certified Family Medicine', 'Advanced Cardiac Life Support'],
        isVerified: true
      },
      {
        name: 'Dr. Michael Chen',
        specialty: 'Cardiology',
        rating: 4.9,
        reviewCount: 89,
        experience: 15,
        languages: ['English', 'Mandarin'],
        availability: {
          monday: ['08:00', '16:00'],
          tuesday: ['08:00', '16:00'],
          thursday: ['08:00', '16:00'],
          friday: ['08:00', '14:00']
        },
        hourlyRate: 350,
        bio: 'Interventional cardiologist specializing in advanced cardiac procedures and heart disease prevention.',
        education: ['MD - Harvard Medical School', 'Cardiology Fellowship - Mayo Clinic'],
        certifications: ['Board Certified Cardiology', 'Board Certified Internal Medicine'],
        isVerified: true
      },
      {
        name: 'Dr. Emily Rodriguez',
        specialty: 'Pediatrics',
        rating: 4.7,
        reviewCount: 203,
        experience: 8,
        languages: ['English', 'Spanish', 'Portuguese'],
        availability: {
          monday: ['10:00', '18:00'],
          tuesday: ['10:00', '18:00'],
          wednesday: ['10:00', '18:00'],
          friday: ['10:00', '16:00'],
          saturday: ['09:00', '13:00']
        },
        hourlyRate: 180,
        bio: 'Pediatrician passionate about child health and development, with special interest in preventive care.',
        education: ['MD - University of Texas Southwestern', 'Pediatrics Residency - Children\'s Hospital of Philadelphia'],
        certifications: ['Board Certified Pediatrics', 'Pediatric Advanced Life Support'],
        isVerified: true
      }
    ];

    for (const provider of mockProviders) {
      const existing = await prisma.provider.findFirst({
        where: { name: provider.name }
      });

      if (!existing) {
        await prisma.provider.create({
          data: {
            ...provider,
            languages: JSON.stringify(provider.languages),
            availability: JSON.stringify(provider.availability),
            education: JSON.stringify(provider.education),
            certifications: JSON.stringify(provider.certifications)
          }
        });
      }
    }
  }

  static async searchProviders(filters: ProviderSearchFilters = {}, limit = 20) {
    const where: any = { isActive: true };

    if (filters.specialty) {
      where.specialty = { contains: filters.specialty, mode: 'insensitive' };
    }

    if (filters.minRating) {
      where.rating = { gte: filters.minRating };
    }

    if (filters.maxRate) {
      where.hourlyRate = { lte: filters.maxRate };
    }

    const providers = await prisma.provider.findMany({
      where,
      orderBy: [
        { isVerified: 'desc' },
        { rating: 'desc' },
        { reviewCount: 'desc' }
      ],
      take: limit
    });

    return providers.map(provider => ({
      ...provider,
      languages: this.parseJSONField(provider.languages),
      availability: this.parseJSONField(provider.availability),
      education: this.parseJSONField(provider.education),
      certifications: this.parseJSONField(provider.certifications)
    }));
  }

  static async getProviderById(id: string) {
    const provider = await prisma.provider.findUnique({
      where: { id },
      include: {
        appointments: {
          where: {
            status: { in: ['COMPLETED'] }
          },
          take: 5,
          orderBy: { dateTime: 'desc' }
        }
      }
    });

    if (!provider) return null;

    return {
      ...provider,
      languages: this.parseJSONField(provider.languages),
      availability: this.parseJSONField(provider.availability),
      education: this.parseJSONField(provider.education),
      certifications: this.parseJSONField(provider.certifications)
    };
  }

  static async updateProvider(id: string, data: Partial<CreateProviderData>) {
    const updateData: any = { ...data };
    
    if (data.languages) updateData.languages = JSON.stringify(data.languages);
    if (data.availability) updateData.availability = JSON.stringify(data.availability);
    if (data.education) updateData.education = JSON.stringify(data.education);
    if (data.certifications) updateData.certifications = JSON.stringify(data.certifications);

    return prisma.provider.update({
      where: { id },
      data: updateData
    });
  }

  private static parseJSONField(field: string | null) {
    if (!field) return null;
    try {
      return JSON.parse(field);
    } catch {
      return field;
    }
  }
}