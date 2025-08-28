import { prisma } from '@/lib/prisma';
import { Appointment, AppointmentStatus } from '@prisma/client';

export interface CreateAppointmentData {
  userId: string;
  providerId: string;
  dateTime: Date;
  duration?: number;
  type?: string;
  notes?: string;
}

export interface UpdateAppointmentData {
  dateTime?: Date;
  duration?: number;
  type?: string;
  status?: AppointmentStatus;
  notes?: string;
  meetingLink?: string;
  cost?: number;
  diagnosis?: string;
  prescription?: string;
  followUpDate?: Date;
}

export interface AppointmentFilters {
  userId?: string;
  providerId?: string;
  status?: AppointmentStatus;
  dateFrom?: Date;
  dateTo?: Date;
  type?: string;
}

export class AppointmentService {
  static async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    // Generate meeting link for virtual appointments
    const meetingLink = `https://meet.healthtriage.ai/room/${Math.random().toString(36).substr(2, 9)}`;
    
    return prisma.appointment.create({
      data: {
        ...data,
        duration: data.duration || 30,
        type: data.type || 'consultation',
        meetingLink,
        status: 'SCHEDULED'
      }
    });
  }

  static async getAppointmentById(id: string) {
    return prisma.appointment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            dateOfBirth: true,
            gender: true,
            allergies: true,
            medications: true,
            medicalHistory: true
          }
        },
        provider: {
          select: {
            id: true,
            name: true,
            specialty: true,
            languages: true
          }
        }
      }
    });
  }

  static async getUserAppointments(userId: string, status?: AppointmentStatus) {
    const where: any = { userId };
    if (status) where.status = status;

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            specialty: true,
            rating: true,
            languages: true
          }
        }
      },
      orderBy: { dateTime: 'desc' }
    });

    return appointments.map(appointment => ({
      ...appointment,
      provider: {
        ...appointment.provider,
        languages: this.parseJSONField(appointment.provider.languages)
      },
      prescription: this.parseJSONField(appointment.prescription)
    }));
  }

  static async getProviderAppointments(providerId: string, status?: AppointmentStatus) {
    const where: any = { providerId };
    if (status) where.status = status;

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            dateOfBirth: true,
            gender: true
          }
        }
      },
      orderBy: { dateTime: 'asc' }
    });

    return appointments;
  }

  static async updateAppointment(id: string, data: UpdateAppointmentData): Promise<Appointment> {
    const updateData: any = { ...data };
    
    if (data.prescription) {
      updateData.prescription = JSON.stringify(data.prescription);
    }

    return prisma.appointment.update({
      where: { id },
      data: updateData
    });
  }

  static async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
    return prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        notes: reason ? `Cancelled: ${reason}` : 'Cancelled'
      }
    });
  }

  static async getAvailableSlots(providerId: string, date: Date) {
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    // Get provider's availability
    const provider = await prisma.provider.findUnique({
      where: { id: providerId },
      select: { availability: true }
    });

    if (!provider) throw new Error('Provider not found');

    // Get existing appointments for the day
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        providerId,
        dateTime: {
          gte: startOfDay,
          lt: endOfDay
        },
        status: { in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'] }
      },
      select: { dateTime: true, duration: true }
    });

    // Parse provider availability
    const availability = this.parseJSONField(provider.availability) || {};
    const dayName = date.toLocaleDateString('en', { weekday: 'long' }).toLowerCase();
    const daySchedule = availability[dayName];

    if (!daySchedule || !Array.isArray(daySchedule) || daySchedule.length < 2) {
      return []; // Provider not available on this day
    }

    const [startTime, endTime] = daySchedule;
    const availableSlots: Date[] = [];

    // Generate 30-minute slots
    const start = new Date(`${date.toDateString()} ${startTime}`);
    const end = new Date(`${date.toDateString()} ${endTime}`);

    for (let slot = new Date(start); slot < end; slot.setMinutes(slot.getMinutes() + 30)) {
      const slotTime = new Date(slot);
      
      // Check if slot conflicts with existing appointments
      const isBooked = existingAppointments.some(appt => {
        const apptStart = new Date(appt.dateTime);
        const apptEnd = new Date(apptStart.getTime() + appt.duration * 60000);
        return slotTime >= apptStart && slotTime < apptEnd;
      });

      if (!isBooked && slotTime > new Date()) { // Only future slots
        availableSlots.push(new Date(slotTime));
      }
    }

    return availableSlots;
  }

  static async searchAppointments(filters: AppointmentFilters, limit = 50) {
    const where: any = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.providerId) where.providerId = filters.providerId;
    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;

    if (filters.dateFrom || filters.dateTo) {
      where.dateTime = {};
      if (filters.dateFrom) where.dateTime.gte = filters.dateFrom;
      if (filters.dateTo) where.dateTime.lte = filters.dateTo;
    }

    return prisma.appointment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        provider: {
          select: {
            id: true,
            name: true,
            specialty: true
          }
        }
      },
      orderBy: { dateTime: 'desc' },
      take: limit
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