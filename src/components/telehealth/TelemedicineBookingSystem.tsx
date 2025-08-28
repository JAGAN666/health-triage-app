"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Video,
  Phone,
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  Star,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MessageSquare,
  FileText,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Camera,
  CameraOff,
  Volume2,
  VolumeX,
  Wifi,
  Shield,
  Signal,
  Settings,
  Users,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Provider {
  id: string;
  name: string;
  title: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  image: string;
  availability: {
    today: boolean;
    nextAvailable: string;
    timeSlots: string[];
  };
  pricing: {
    consultation: number;
    followUp: number;
  };
  languages: string[];
  experience: number;
  location: string;
  verified: boolean;
}

interface Appointment {
  id: string;
  providerId: string;
  patientName: string;
  date: string;
  time: string;
  type: 'video' | 'phone' | 'chat';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  duration: number;
  symptoms: string;
  notes?: string;
}

interface VideoCallState {
  isActive: boolean;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isScreenSharing: boolean;
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
  duration: number;
  participants: {
    patient: { name: string; video: boolean; audio: boolean };
    provider: { name: string; video: boolean; audio: boolean };
  };
}

export default function TelemedicineBookingSystem() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [videoCallState, setVideoCallState] = useState<VideoCallState>({
    isActive: false,
    isVideoOn: true,
    isAudioOn: true,
    isScreenSharing: false,
    connectionQuality: 'excellent',
    duration: 0,
    participants: {
      patient: { name: 'You', video: true, audio: true },
      provider: { name: '', video: true, audio: true }
    }
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingStep, setBookingStep] = useState<'browse' | 'schedule' | 'confirm' | 'video'>('browse');
  const [searchSpecialty, setSearchSpecialty] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{id: string, sender: 'patient' | 'provider', message: string, time: string}>>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    initializeTelemedicineData();
  }, []);

  const initializeTelemedicineData = async () => {
    // Mock providers data
    const mockProviders: Provider[] = [
      {
        id: 'dr-sarah-johnson',
        name: 'Dr. Sarah Johnson',
        title: 'MD, FACP',
        specialty: 'Internal Medicine',
        rating: 4.9,
        reviewCount: 342,
        image: '/api/placeholder/150/150',
        availability: {
          today: true,
          nextAvailable: 'Today 2:30 PM',
          timeSlots: ['2:30 PM', '3:00 PM', '4:15 PM', '5:45 PM']
        },
        pricing: {
          consultation: 150,
          followUp: 75
        },
        languages: ['English', 'Spanish'],
        experience: 12,
        location: 'San Francisco, CA',
        verified: true
      },
      {
        id: 'dr-michael-chen',
        name: 'Dr. Michael Chen',
        title: 'MD, FACEP',
        specialty: 'Emergency Medicine',
        rating: 4.8,
        reviewCount: 198,
        image: '/api/placeholder/150/150',
        availability: {
          today: false,
          nextAvailable: 'Tomorrow 10:00 AM',
          timeSlots: ['10:00 AM', '11:30 AM', '1:00 PM', '3:30 PM']
        },
        pricing: {
          consultation: 200,
          followUp: 100
        },
        languages: ['English', 'Mandarin'],
        experience: 8,
        location: 'New York, NY',
        verified: true
      },
      {
        id: 'dr-emily-rodriguez',
        name: 'Dr. Emily Rodriguez',
        title: 'MD, FAAP',
        specialty: 'Pediatrics',
        rating: 4.95,
        reviewCount: 445,
        image: '/api/placeholder/150/150',
        availability: {
          today: true,
          nextAvailable: 'Today 1:00 PM',
          timeSlots: ['1:00 PM', '2:15 PM', '4:00 PM', '6:30 PM']
        },
        pricing: {
          consultation: 120,
          followUp: 60
        },
        languages: ['English', 'Spanish', 'Portuguese'],
        experience: 15,
        location: 'Miami, FL',
        verified: true
      },
      {
        id: 'dr-james-wilson',
        name: 'Dr. James Wilson',
        title: 'MD, PhD',
        specialty: 'Dermatology',
        rating: 4.7,
        reviewCount: 276,
        image: '/api/placeholder/150/150',
        availability: {
          today: false,
          nextAvailable: 'Tuesday 9:00 AM',
          timeSlots: ['9:00 AM', '10:30 AM', '2:00 PM', '4:45 PM']
        },
        pricing: {
          consultation: 175,
          followUp: 85
        },
        languages: ['English'],
        experience: 20,
        location: 'Los Angeles, CA',
        verified: true
      }
    ];

    const mockAppointments: Appointment[] = [
      {
        id: 'appt-001',
        providerId: 'dr-sarah-johnson',
        patientName: 'John Doe',
        date: new Date().toISOString().split('T')[0],
        time: '2:30 PM',
        type: 'video',
        status: 'scheduled',
        duration: 30,
        symptoms: 'Persistent cough and mild fever for 3 days'
      }
    ];

    setProviders(mockProviders);
    setAppointments(mockAppointments);
  };

  const bookAppointment = async () => {
    if (!selectedProvider || !selectedDate || !selectedTime) return;

    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      providerId: selectedProvider.id,
      patientName: 'John Doe', // Would come from user context
      date: selectedDate,
      time: selectedTime,
      type: 'video',
      status: 'scheduled',
      duration: 30,
      symptoms: 'General consultation'
    };

    setAppointments(prev => [...prev, newAppointment]);
    setBookingStep('confirm');
  };

  const startVideoCall = async () => {
    try {
      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setVideoCallState(prev => ({
        ...prev,
        isActive: true,
        participants: {
          ...prev.participants,
          provider: { name: selectedProvider?.name || 'Provider', video: true, audio: true }
        }
      }));

      setBookingStep('video');

      // Start call timer
      let seconds = 0;
      callTimerRef.current = setInterval(() => {
        seconds++;
        setVideoCallState(prev => ({ ...prev, duration: seconds }));
      }, 1000);

    } catch (error) {
      console.error('Failed to start video call:', error);
    }
  };

  const endVideoCall = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }

    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }

    setVideoCallState(prev => ({
      ...prev,
      isActive: false,
      duration: 0
    }));

    setBookingStep('browse');
  };

  const toggleVideo = () => {
    setVideoCallState(prev => ({ ...prev, isVideoOn: !prev.isVideoOn }));
    
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !videoCallState.isVideoOn;
      });
    }
  };

  const toggleAudio = () => {
    setVideoCallState(prev => ({ ...prev, isAudioOn: !prev.isAudioOn }));
    
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !videoCallState.isAudioOn;
      });
    }
  };

  const sendChatMessage = (message: string) => {
    const newMessage = {
      id: Date.now().toString(),
      sender: 'patient' as const,
      message,
      time: new Date().toLocaleTimeString()
    };
    setChatMessages(prev => [...prev, newMessage]);
    
    // Simulate provider response
    setTimeout(() => {
      const providerResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'provider' as const,
        message: 'Thank you for that information. Let me review your symptoms.',
        time: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, providerResponse]);
    }, 2000);
  };

  const filteredProviders = providers.filter(provider => 
    provider.specialty.toLowerCase().includes(searchSpecialty.toLowerCase()) ||
    provider.name.toLowerCase().includes(searchSpecialty.toLowerCase())
  );

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionIcon = (quality: string) => {
    switch (quality) {
      case 'excellent': return <Signal className="w-4 h-4 text-green-600" />;
      case 'good': return <Signal className="w-4 h-4 text-blue-600" />;
      case 'fair': return <Signal className="w-4 h-4 text-yellow-600" />;
      case 'poor': return <Signal className="w-4 h-4 text-red-600" />;
      default: return <Signal className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
            <Video className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Telemedicine Platform
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <Video className="w-3 h-3 mr-1" />
                HD Video Calls
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Calendar className="w-3 h-3 mr-1" />
                Instant Booking
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                <Stethoscope className="w-3 h-3 mr-1" />
                Licensed Providers
              </Badge>
            </div>
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          Connect with licensed healthcare providers through secure video consultations, available 24/7
        </p>
      </motion.div>

      {/* Video Call Interface */}
      <AnimatePresence>
        {bookingStep === 'video' && videoCallState.isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black z-50 flex flex-col"
          >
            {/* Call Header */}
            <div className="bg-gray-900/80 backdrop-blur-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">Live Consultation</span>
                </div>
                <div className="text-white text-sm">
                  {formatCallDuration(videoCallState.duration)}
                </div>
                <div className="flex items-center gap-1">
                  {getConnectionIcon(videoCallState.connectionQuality)}
                  <span className="text-white text-xs capitalize">{videoCallState.connectionQuality}</span>
                </div>
              </div>
              
              <div className="text-white text-lg font-semibold">
                {selectedProvider?.name}
              </div>
            </div>

            {/* Video Area */}
            <div className="flex-1 relative">
              {/* Provider Video (Main) */}
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <div className="w-64 h-48 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-white">
                    <User className="w-16 h-16 mx-auto mb-2" />
                    <div className="font-semibold">{selectedProvider?.name}</div>
                    <div className="text-sm opacity-75">{selectedProvider?.specialty}</div>
                  </div>
                </div>
              </div>

              {/* Patient Video (Picture-in-Picture) */}
              <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
                {!videoCallState.isVideoOn && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <CameraOff className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Chat Panel */}
              <div className="absolute left-4 top-4 bottom-20 w-80 bg-white/95 backdrop-blur-sm rounded-2xl p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Consultation Chat</span>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {chatMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-xl max-w-[80%] ${
                        msg.sender === 'patient' 
                          ? 'bg-blue-500 text-white ml-auto' 
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="text-sm">{msg.message}</div>
                      <div className={`text-xs mt-1 ${
                        msg.sender === 'patient' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {msg.time}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        sendChatMessage(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Call Controls */}
            <div className="bg-gray-900/80 backdrop-blur-sm p-6">
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={toggleVideo}
                  className={`w-12 h-12 rounded-full ${
                    videoCallState.isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {videoCallState.isVideoOn ? <Camera className="w-6 h-6 text-white" /> : <CameraOff className="w-6 h-6 text-white" />}
                </Button>
                
                <Button
                  onClick={toggleAudio}
                  className={`w-12 h-12 rounded-full ${
                    videoCallState.isAudioOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {videoCallState.isAudioOn ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6 text-white" />}
                </Button>

                <Button
                  onClick={() => setVideoCallState(prev => ({ ...prev, isScreenSharing: !prev.isScreenSharing }))}
                  className={`w-12 h-12 rounded-full ${
                    videoCallState.isScreenSharing ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <Monitor className="w-6 h-6 text-white" />
                </Button>

                <Button
                  onClick={endVideoCall}
                  className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white"
                >
                  <Phone className="w-6 h-6 rotate-[225deg]" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Interface */}
      {bookingStep !== 'video' && (
        <>
          {/* Search and Browse */}
          {bookingStep === 'browse' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Users className="w-6 h-6" />
                      Find Healthcare Providers
                    </CardTitle>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search by specialty or name..."
                        value={searchSpecialty}
                        onChange={(e) => setSearchSpecialty(e.target.value)}
                        className="w-64"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-6">
                    {filteredProviders.map((provider, index) => (
                      <motion.div
                        key={provider.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-white/50 rounded-xl border border-gray-200/50 hover:bg-white/70 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedProvider(provider);
                          setBookingStep('schedule');
                        }}
                      >
                        {/* Provider Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900 text-lg">{provider.name}</h3>
                              {provider.verified && (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              )}
                            </div>
                            <p className="text-gray-600 text-sm">{provider.title}</p>
                            <p className="text-blue-600 font-medium">{provider.specialty}</p>
                          </div>
                        </div>

                        {/* Rating and Reviews */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-bold text-gray-900">{provider.rating}</span>
                            <span className="text-gray-600 text-sm">({provider.reviewCount} reviews)</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600 text-sm">
                            <MapPin className="w-4 h-4" />
                            {provider.location}
                          </div>
                        </div>

                        {/* Availability */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-600">
                              {provider.availability.today ? 'Available Today' : provider.availability.nextAvailable}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {provider.availability.timeSlots.slice(0, 3).map((slot, i) => (
                              <Badge key={i} className="bg-green-100 text-green-800 border-green-200 text-xs">
                                {slot}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Pricing and Languages */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-600">Consultation</div>
                            <div className="font-bold text-lg">${provider.pricing.consultation}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Experience</div>
                            <div className="font-bold text-lg">{provider.experience} years</div>
                          </div>
                        </div>

                        {/* Languages */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Languages:</span>
                          <div className="flex gap-1">
                            {provider.languages.map((lang, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Schedule Appointment */}
          {bookingStep === 'schedule' && selectedProvider && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() => setBookingStep('browse')}
                      variant="ghost"
                      className="rounded-xl"
                    >
                      ←
                    </Button>
                    <div>
                      <CardTitle className="text-2xl">Schedule with {selectedProvider.name}</CardTitle>
                      <p className="text-gray-600">{selectedProvider.specialty} • {selectedProvider.location}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Date Selection */}
                    <div>
                      <h4 className="font-semibold text-lg mb-4">Select Date</h4>
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="mb-4"
                      />
                      
                      <h4 className="font-semibold text-lg mb-4">Available Times</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedProvider.availability.timeSlots.map((slot, index) => (
                          <Button
                            key={index}
                            onClick={() => setSelectedTime(slot)}
                            className={`p-3 ${
                              selectedTime === slot
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                            } rounded-xl`}
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Appointment Summary */}
                    <div>
                      <h4 className="font-semibold text-lg mb-4">Appointment Summary</h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Provider:</span>
                            <span className="font-medium">{selectedProvider.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Specialty:</span>
                            <span className="font-medium">{selectedProvider.specialty}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Date:</span>
                            <span className="font-medium">{selectedDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time:</span>
                            <span className="font-medium">{selectedTime || 'Please select'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Duration:</span>
                            <span className="font-medium">30 minutes</span>
                          </div>
                          <div className="border-t pt-3 flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span>${selectedProvider.pricing.consultation}</span>
                          </div>
                        </div>
                        
                        <Button
                          onClick={bookAppointment}
                          disabled={!selectedTime}
                          className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Appointment
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Confirmation */}
          {bookingStep === 'confirm' && selectedProvider && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h3>
                    <p className="text-gray-600 mb-6">
                      Your video consultation with {selectedProvider.name} has been scheduled for {selectedDate} at {selectedTime}.
                    </p>
                    
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={() => setBookingStep('browse')}
                        variant="outline"
                        className="rounded-xl"
                      >
                        Book Another
                      </Button>
                      <Button
                        onClick={startVideoCall}
                        className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Start Call Now (Demo)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </>
      )}

      {/* Platform Features */}
      {bookingStep === 'browse' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl">
            <CardContent className="p-6">
              <h4 className="font-bold text-blue-900 mb-4 text-center text-lg">
                🏥 Professional Telemedicine Platform Features
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <Video className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-blue-900">HD Video Calls</div>
                  <div className="text-sm text-blue-700">Crystal clear video consultations</div>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold text-green-900">HIPAA Compliant</div>
                  <div className="text-sm text-green-700">Secure and private healthcare</div>
                </div>
                <div className="text-center">
                  <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-semibold text-purple-900">24/7 Availability</div>
                  <div className="text-sm text-purple-700">Healthcare when you need it</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}