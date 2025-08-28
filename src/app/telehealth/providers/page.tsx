"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Search, 
  Star, 
  MapPin, 
  Clock, 
  Video, 
  Phone,
  Calendar,
  Filter,
  Users,
  Award,
  Languages,
  Stethoscope
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Provider {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  location: string;
  distance: string;
  availability: 'Available Now' | 'Today' | 'Tomorrow' | 'Next Week';
  languages: string[];
  experience: number;
  consultationFee: number;
  image: string;
  verified: boolean;
  telehealth: boolean;
  bio: string;
}

const PROVIDERS: Provider[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Family Medicine',
    rating: 4.8,
    reviewCount: 124,
    location: 'San Francisco, CA',
    distance: '2.3 miles',
    availability: 'Available Now',
    languages: ['English', 'Spanish'],
    experience: 8,
    consultationFee: 85,
    image: '/api/placeholder/150/150',
    verified: true,
    telehealth: true,
    bio: 'Board-certified family physician with expertise in preventive care and chronic disease management.'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Internal Medicine',
    rating: 4.9,
    reviewCount: 89,
    location: 'Palo Alto, CA',
    distance: '5.1 miles',
    availability: 'Today',
    languages: ['English', 'Mandarin'],
    experience: 12,
    consultationFee: 95,
    image: '/api/placeholder/150/150',
    verified: true,
    telehealth: true,
    bio: 'Experienced internist specializing in adult primary care and complex medical conditions.'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Dermatology',
    rating: 4.7,
    reviewCount: 156,
    location: 'San Jose, CA',
    distance: '8.7 miles',
    availability: 'Tomorrow',
    languages: ['English', 'Spanish'],
    experience: 6,
    consultationFee: 120,
    image: '/api/placeholder/150/150',
    verified: true,
    telehealth: true,
    bio: 'Dermatologist focused on medical dermatology and cosmetic procedures.'
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Cardiology',
    rating: 4.9,
    reviewCount: 203,
    location: 'Mountain View, CA',
    distance: '6.2 miles',
    availability: 'Next Week',
    languages: ['English'],
    experience: 15,
    consultationFee: 150,
    image: '/api/placeholder/150/150',
    verified: true,
    telehealth: true,
    bio: 'Interventional cardiologist with extensive experience in heart disease prevention and treatment.'
  },
  {
    id: '5',
    name: 'Dr. Lisa Thompson',
    specialty: 'Mental Health',
    rating: 4.8,
    reviewCount: 98,
    location: 'Redwood City, CA',
    distance: '4.5 miles',
    availability: 'Available Now',
    languages: ['English'],
    experience: 10,
    consultationFee: 110,
    image: '/api/placeholder/150/150',
    verified: true,
    telehealth: true,
    bio: 'Licensed psychiatrist specializing in anxiety, depression, and stress management.'
  },
  {
    id: '6',
    name: 'Dr. Robert Martinez',
    specialty: 'Orthopedics',
    rating: 4.6,
    reviewCount: 67,
    location: 'Santa Clara, CA',
    distance: '7.8 miles',
    availability: 'Today',
    languages: ['English', 'Spanish'],
    experience: 9,
    consultationFee: 130,
    image: '/api/placeholder/150/150',
    verified: true,
    telehealth: false,
    bio: 'Orthopedic surgeon specializing in sports medicine and joint replacement.'
  }
];

const SPECIALTIES = [
  'All Specialties',
  'Family Medicine',
  'Internal Medicine',
  'Dermatology',
  'Cardiology',
  'Mental Health',
  'Orthopedics',
  'Pediatrics',
  'Gynecology',
  'Neurology'
];

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>(PROVIDERS);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>(PROVIDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [telehealthOnly, setTelehealthOnly] = useState(false);

  useEffect(() => {
    let filtered = providers;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Specialty filter
    if (selectedSpecialty !== 'All Specialties') {
      filtered = filtered.filter(provider => provider.specialty === selectedSpecialty);
    }

    // Availability filter
    if (availabilityFilter !== 'All') {
      filtered = filtered.filter(provider => provider.availability === availabilityFilter);
    }

    // Telehealth filter
    if (telehealthOnly) {
      filtered = filtered.filter(provider => provider.telehealth);
    }

    setFilteredProviders(filtered);
  }, [providers, searchQuery, selectedSpecialty, availabilityFilter, telehealthOnly]);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available Now':
        return 'bg-green-100 text-green-800';
      case 'Today':
        return 'bg-blue-100 text-blue-800';
      case 'Tomorrow':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Healthcare Providers</h1>
              <p className="text-gray-600 mt-1">Find and connect with qualified healthcare professionals</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-100 text-blue-800">
                <Users className="w-3 h-3 mr-1" />
                {filteredProviders.length} Available
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search providers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Specialty</label>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALTIES.map(specialty => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Availability</label>
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Available Now">Available Now</SelectItem>
                    <SelectItem value="Today">Today</SelectItem>
                    <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="Next Week">Next Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col justify-end">
                <Button
                  variant={telehealthOnly ? "default" : "outline"}
                  onClick={() => setTelehealthOnly(!telehealthOnly)}
                  className="gap-2"
                >
                  <Video className="w-4 h-4" />
                  Telehealth Only
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Provider List */}
        <div className="space-y-6">
          {filteredProviders.map((provider) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Provider Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                          {provider.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-semibold text-gray-900">{provider.name}</h3>
                            {provider.verified && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                <Award className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-purple-600 font-medium mb-2">{provider.specialty}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-medium">{provider.rating}</span>
                              <span>({provider.reviewCount} reviews)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Stethoscope className="w-4 h-4" />
                              <span>{provider.experience} years exp.</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{provider.location} • {provider.distance}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm">{provider.bio}</p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Availability</p>
                        <Badge className={getAvailabilityColor(provider.availability)}>
                          <Clock className="w-3 h-3 mr-1" />
                          {provider.availability}
                        </Badge>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Languages</p>
                        <div className="flex flex-wrap gap-1">
                          {provider.languages.map(lang => (
                            <Badge key={lang} variant="outline" className="text-xs">
                              <Languages className="w-3 h-3 mr-1" />
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {provider.telehealth && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Video className="w-3 h-3 mr-1" />
                          Telehealth Available
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">${provider.consultationFee}</p>
                        <p className="text-sm text-gray-500">consultation fee</p>
                      </div>

                      <div className="space-y-2">
                        <Button asChild className="w-full">
                          <Link href={`/telehealth/appointments?provider=${provider.id}`}>
                            <Calendar className="w-4 h-4 mr-2" />
                            Book Appointment
                          </Link>
                        </Button>
                        
                        {provider.telehealth && (
                          <Button variant="outline" className="w-full">
                            <Video className="w-4 h-4 mr-2" />
                            Video Call
                          </Button>
                        )}
                        
                        <Button variant="outline" className="w-full">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Office
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredProviders.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No providers found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters to find more providers
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSpecialty('All Specialties');
                    setAvailabilityFilter('All');
                    setTelehealthOnly(false);
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Popular Specialties */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Popular Specialties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {SPECIALTIES.slice(1, 6).map(specialty => (
                <Button
                  key={specialty}
                  variant="outline"
                  className="justify-start h-auto p-3"
                  onClick={() => setSelectedSpecialty(specialty)}
                >
                  <div className="text-left">
                    <p className="font-medium">{specialty}</p>
                    <p className="text-xs text-gray-500">
                      {providers.filter(p => p.specialty === specialty).length} doctors
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}