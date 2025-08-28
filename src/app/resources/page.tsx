"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  ExternalLink, 
  Clock, 
  DollarSign,
  Search,
  Filter,
  Navigation,
  Hospital,
  Building2,
  Pill,
  HeadphonesIcon,
  Brain
} from "lucide-react";
import Link from "next/link";

interface Resource {
  id: string;
  name: string;
  type: 'CLINIC' | 'HOSPITAL' | 'PHARMACY' | 'HOTLINE' | 'MENTAL_HEALTH';
  address?: string;
  phone?: string;
  website?: string;
  hours?: string;
  cost?: string;
  zipCode?: string;
  city?: string;
  state?: string;
  distance?: number;
}

const RESOURCE_TYPES = {
  CLINIC: { label: 'Clinics', icon: Building2, color: 'bg-blue-100 text-blue-800' },
  HOSPITAL: { label: 'Hospitals', icon: Hospital, color: 'bg-red-100 text-red-800' },
  PHARMACY: { label: 'Pharmacies', icon: Pill, color: 'bg-green-100 text-green-800' },
  HOTLINE: { label: 'Hotlines', icon: HeadphonesIcon, color: 'bg-purple-100 text-purple-800' },
  MENTAL_HEALTH: { label: 'Mental Health', icon: Brain, color: 'bg-pink-100 text-pink-800' },
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [zipCode, setZipCode] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [showOpenOnly, setShowOpenOnly] = useState(false);

  // Load resources
  useEffect(() => {
    fetchResources();
    requestLocation();
  }, []);

  // Filter resources based on search criteria
  useEffect(() => {
    let filtered = resources;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    // Filter by location (if zip code provided)
    if (zipCode) {
      filtered = filtered.filter(resource => 
        resource.zipCode?.includes(zipCode) || 
        resource.city?.toLowerCase().includes(zipCode.toLowerCase())
      );
    }

    // Filter by open now (simplified - would need real hours checking)
    if (showOpenOnly) {
      filtered = filtered.filter(resource => {
        if (resource.type === 'HOTLINE') return true; // Hotlines usually 24/7
        // Simplified logic - in real app, would parse hours and check current time
        return resource.hours?.includes('24/7') || 
               resource.type === 'HOSPITAL'; // Hospitals usually always open
      });
    }

    setFilteredResources(filtered);
  }, [resources, searchTerm, selectedType, zipCode, showOpenOnly]);

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources');
      const data = await response.json();
      setResources(data.resources || []);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  };

  const parseHours = (hoursJson: string) => {
    try {
      const hours = JSON.parse(hoursJson);
      if (hours['24/7']) return '24/7';
      
      return Object.entries(hours).map(([day, time]) => `${day}: ${time}`).join(', ');
    } catch {
      return hoursJson;
    }
  };

  const getResourceIcon = (type: string) => {
    const IconComponent = RESOURCE_TYPES[type as keyof typeof RESOURCE_TYPES]?.icon || Building2;
    return IconComponent;
  };

  const openDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading healthcare resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">Healthcare Resources</h1>
              <p className="text-sm text-gray-600">Find nearby clinics, hospitals, and support services</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Find Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(RESOURCE_TYPES).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Location */}
              <Input
                placeholder="ZIP code or city..."
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />

              {/* Open Now Filter */}
              <Button
                variant={showOpenOnly ? "default" : "outline"}
                onClick={() => setShowOpenOnly(!showOpenOnly)}
                className="justify-start"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showOpenOnly ? "Showing open now" : "Show open now"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid gap-4">
          {filteredResources.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No resources found</h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or location.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredResources.map((resource) => {
              const IconComponent = getResourceIcon(resource.type);
              return (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <IconComponent className="w-6 h-6 text-blue-600 mt-1" />
                        <div>
                          <h3 className="text-lg font-semibold">{resource.name}</h3>
                          {resource.address && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {resource.address}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge className={RESOURCE_TYPES[resource.type]?.color}>
                        {RESOURCE_TYPES[resource.type]?.label}
                      </Badge>
                    </div>

                    {/* Details */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      {resource.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{resource.phone}</span>
                        </div>
                      )}
                      
                      {resource.hours && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>{parseHours(resource.hours)}</span>
                        </div>
                      )}
                      
                      {resource.cost && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span>{resource.cost}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {resource.phone && (
                        <Button
                          size="sm"
                          onClick={() => window.open(`tel:${resource.phone?.replace(/\D/g, '')}`)}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                      )}
                      
                      {resource.address && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDirections(resource.address!)}
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Directions
                        </Button>
                      )}
                      
                      {resource.website && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(resource.website, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Website
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Emergency Notice */}
        <Card className="mt-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-800">In case of emergency:</p>
                <p className="text-sm text-red-700">
                  Call 911 for immediate emergency services, or go to your nearest emergency room.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}