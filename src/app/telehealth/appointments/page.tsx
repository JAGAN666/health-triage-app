"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  User,
  CheckCircle,
  AlertCircle,
  CalendarDays,
  Plus,
  Edit,
  Trash2,
  Bell
} from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface Appointment {
  id: string;
  providerId: string;
  providerName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'video' | 'phone' | 'in-person';
  status: 'upcoming' | 'completed' | 'cancelled';
  reason: string;
  location?: string;
}

const TIME_SLOTS: TimeSlot[] = [
  { time: '9:00 AM', available: true },
  { time: '9:30 AM', available: false },
  { time: '10:00 AM', available: true },
  { time: '10:30 AM', available: true },
  { time: '11:00 AM', available: false },
  { time: '11:30 AM', available: true },
  { time: '2:00 PM', available: true },
  { time: '2:30 PM', available: true },
  { time: '3:00 PM', available: false },
  { time: '3:30 PM', available: true },
  { time: '4:00 PM', available: true },
  { time: '4:30 PM', available: true }
];

export default function AppointmentsPage() {
  const searchParams = useSearchParams();
  const providerId = searchParams.get('provider');
  
  const [activeTab, setActiveTab] = useState<'book' | 'upcoming' | 'history'>('book');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState<'video' | 'phone' | 'in-person'>('video');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Mock appointments data
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      providerId: '1',
      providerName: 'Dr. Sarah Johnson',
      specialty: 'Family Medicine',
      date: '2024-02-15',
      time: '2:00 PM',
      type: 'video',
      status: 'upcoming',
      reason: 'Annual checkup',
    },
    {
      id: '2',
      providerId: '2',
      providerName: 'Dr. Michael Chen',
      specialty: 'Internal Medicine',
      date: '2024-01-20',
      time: '10:30 AM',
      type: 'video',
      status: 'completed',
      reason: 'Follow-up consultation',
    }
  ]);

  // Set default date to today
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !reason) {
      return;
    }

    setIsBooking(true);

    // Simulate API call
    setTimeout(() => {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        providerId: providerId || '1',
        providerName: 'Dr. Sarah Johnson', // This would come from provider data
        specialty: 'Family Medicine',
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
        status: 'upcoming',
        reason: reason,
        location: appointmentType === 'in-person' ? '123 Medical Center Dr, Suite 100' : undefined
      };

      setAppointments(prev => [newAppointment, ...prev]);
      setIsBooking(false);
      setBookingSuccess(true);
      
      // Reset form
      setSelectedTime('');
      setReason('');
      setNotes('');

      // Show success for 3 seconds then switch to upcoming appointments
      setTimeout(() => {
        setBookingSuccess(false);
        setActiveTab('upcoming');
      }, 3000);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'in-person':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');
  const pastAppointments = appointments.filter(apt => apt.status === 'completed' || apt.status === 'cancelled');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
              <p className="text-gray-600 mt-1">Book and manage your healthcare appointments</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-100 text-blue-800">
                <CalendarDays className="w-3 h-3 mr-1" />
                {upcomingAppointments.length} Upcoming
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
          <button
            onClick={() => setActiveTab('book')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'book'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Book Appointment
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Upcoming ({upcomingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            History ({pastAppointments.length})
          </button>
        </div>

        {/* Book Appointment Tab */}
        {activeTab === 'book' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {bookingSuccess && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-900">Appointment Booked Successfully!</h3>
                      <p className="text-green-800">You'll receive a confirmation email shortly.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Booking Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Schedule New Appointment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <Label htmlFor="date">Select Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-1"
                    />
                  </div>

                  {/* Time Selection */}
                  <div>
                    <Label>Available Times</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {TIME_SLOTS.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => slot.available && setSelectedTime(slot.time)}
                          className="h-10"
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Appointment Type */}
                  <div>
                    <Label>Appointment Type</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <Button
                        variant={appointmentType === 'video' ? "default" : "outline"}
                        onClick={() => setAppointmentType('video')}
                        className="h-12 flex-col gap-1"
                      >
                        <Video className="w-4 h-4" />
                        <span className="text-xs">Video Call</span>
                      </Button>
                      <Button
                        variant={appointmentType === 'phone' ? "default" : "outline"}
                        onClick={() => setAppointmentType('phone')}
                        className="h-12 flex-col gap-1"
                      >
                        <Phone className="w-4 h-4" />
                        <span className="text-xs">Phone Call</span>
                      </Button>
                      <Button
                        variant={appointmentType === 'in-person' ? "default" : "outline"}
                        onClick={() => setAppointmentType('in-person')}
                        className="h-12 flex-col gap-1"
                      >
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs">In Person</span>
                      </Button>
                    </div>
                  </div>

                  {/* Reason */}
                  <div>
                    <Label htmlFor="reason">Reason for Visit *</Label>
                    <Select value={reason} onValueChange={setReason}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select reason..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="routine-checkup">Routine Checkup</SelectItem>
                        <SelectItem value="follow-up">Follow-up Appointment</SelectItem>
                        <SelectItem value="new-symptoms">New Symptoms</SelectItem>
                        <SelectItem value="medication-review">Medication Review</SelectItem>
                        <SelectItem value="test-results">Test Results Discussion</SelectItem>
                        <SelectItem value="second-opinion">Second Opinion</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Describe any specific symptoms or concerns..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  {/* Book Button */}
                  <Button
                    onClick={handleBookAppointment}
                    disabled={!selectedDate || !selectedTime || !reason || isBooking}
                    className="w-full"
                  >
                    {isBooking ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Booking Appointment...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Appointment
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Booking Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDate && selectedTime && reason ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            DJ
                          </div>
                          <div>
                            <h3 className="font-semibold">Dr. Sarah Johnson</h3>
                            <p className="text-sm text-gray-600">Family Medicine</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span>{new Date(selectedDate).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span>{selectedTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(appointmentType)}
                            <span className="capitalize">{appointmentType.replace('-', ' ')} Consultation</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-600" />
                            <span>{reason.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-2">What to expect:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• You'll receive a confirmation email</li>
                          <li>• Reminder notification 1 hour before</li>
                          {appointmentType === 'video' && <li>• Join link will be sent via email</li>}
                          {appointmentType === 'phone' && <li>• Doctor will call your registered number</li>}
                          <li>• Bring relevant medical records if available</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Select date, time, and reason to see appointment summary</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Upcoming Appointments Tab */}
        {activeTab === 'upcoming' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {appointment.providerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{appointment.providerName}</h3>
                          <p className="text-gray-600">{appointment.specialty}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(appointment.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {appointment.time}
                            </div>
                            <div className="flex items-center gap-1">
                              {getTypeIcon(appointment.type)}
                              <span className="capitalize">{appointment.type}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                        <div className="flex gap-2">
                          {appointment.type === 'video' && (
                            <Button 
                              size="sm" 
                              onClick={() => window.open(`/telehealth/call/${appointment.id}`, '_blank')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Video className="w-4 h-4 mr-1" />
                              Join Call
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Reason:</strong> {appointment.reason}
                      </p>
                      {appointment.location && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Location:</strong> {appointment.location}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No upcoming appointments</h3>
                  <p className="text-gray-600 mb-4">Book your first appointment to get started</p>
                  <Button onClick={() => setActiveTab('book')}>
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {pastAppointments.length > 0 ? (
              pastAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold">
                          {appointment.providerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{appointment.providerName}</h3>
                          <p className="text-gray-600">{appointment.specialty}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(appointment.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {appointment.time}
                            </div>
                            <div className="flex items-center gap-1">
                              {getTypeIcon(appointment.type)}
                              <span className="capitalize">{appointment.type}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointment history</h3>
                  <p className="text-gray-600">Your completed appointments will appear here</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}