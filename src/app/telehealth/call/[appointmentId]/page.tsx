"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VideoCall from '@/components/telehealth/VideoCall';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Video,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";

interface Appointment {
  id: string;
  providerId: string;
  providerName: string;
  specialty: string;
  dateTime: Date;
  status: string;
  meetingLink?: string;
  type: string;
}

export default function VideoCallPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.appointmentId as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [callStarted, setCallStarted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  useEffect(() => {
    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId]);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      setError('');

      // Mock appointment data - in real app, fetch from API
      const mockAppointment: Appointment = {
        id: appointmentId,
        providerId: '1',
        providerName: 'Dr. Sarah Johnson',
        specialty: 'Family Medicine',
        dateTime: new Date(),
        status: 'scheduled',
        meetingLink: `https://meet.healthtriage.com/${appointmentId}`,
        type: 'video'
      };

      setTimeout(() => {
        setAppointment(mockAppointment);
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Failed to fetch appointment:', error);
      setError('Failed to load appointment details');
      setLoading(false);
    }
  };

  const startCall = () => {
    setCallStarted(true);
  };

  const handleCallEnd = () => {
    setCallStarted(false);
    setCallEnded(true);
    
    // Auto-redirect after 3 seconds
    setTimeout(() => {
      router.push('/telehealth/appointments');
    }, 3000);
  };

  const goBackToAppointments = () => {
    router.push('/telehealth/appointments');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 mx-auto mb-4"
            >
              <Video className="w-12 h-12 text-blue-500" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">Loading Appointment...</h3>
            <p className="text-gray-600">Please wait while we prepare your video call</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2 text-red-900">
              Appointment Not Found
            </h3>
            <p className="text-red-700 mb-4">
              {error || 'The requested appointment could not be found.'}
            </p>
            <Button onClick={goBackToAppointments}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Appointments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (callStarted) {
    return (
      <VideoCall
        appointmentId={appointment.id}
        providerId={appointment.providerId}
        providerName={appointment.providerName}
        onCallEnd={handleCallEnd}
      />
    );
  }

  if (callEnded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2 text-green-900">
              Call Ended Successfully
            </h3>
            <p className="text-green-700 mb-4">
              Your consultation with {appointment.providerName} has ended.
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Redirecting to your appointments...
            </p>
            <Button onClick={goBackToAppointments}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Appointments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pre-call waiting room
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Video Consultation
              </h1>
              <p className="text-gray-600">
                Ready to connect with {appointment.providerName}
              </p>
            </motion.div>
          </div>

          {/* Appointment Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                    {appointment.providerName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {appointment.providerName}
                    </h3>
                    <p className="text-gray-600">{appointment.specialty}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {appointment.dateTime.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Before you join:
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Make sure your camera and microphone are working</li>
                    <li>• Find a quiet, well-lit space</li>
                    <li>• Have your questions and concerns ready</li>
                    <li>• Keep any relevant medical records nearby</li>
                  </ul>
                </div>

                <div className="text-center">
                  <Button
                    onClick={startCall}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg"
                  >
                    <Video className="w-5 h-5 mr-2" />
                    Start Video Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tech Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Technical Requirements
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Browser Support:</h5>
                    <ul className="space-y-1">
                      <li>• Chrome 70+ (recommended)</li>
                      <li>• Firefox 70+</li>
                      <li>• Safari 14+</li>
                      <li>• Edge 80+</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Requirements:</h5>
                    <ul className="space-y-1">
                      <li>• Stable internet connection</li>
                      <li>• Camera and microphone access</li>
                      <li>• Speakers or headphones</li>
                      <li>• Updated browser</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Back Button */}
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={goBackToAppointments}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Appointments
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}