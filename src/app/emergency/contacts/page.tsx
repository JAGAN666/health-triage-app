"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  AlertTriangle,
  Phone,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  User,
  MapPin,
  Clock,
  Shield,
  Bell,
  CheckCircle,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
  canReceiveAlerts: boolean;
  availableHours: string;
  medicalInfo?: string;
}

const RELATIONSHIPS = [
  'Spouse/Partner',
  'Parent',
  'Child',
  'Sibling',
  'Friend',
  'Neighbor',
  'Doctor',
  'Other Family',
  'Caregiver',
  'Other'
];

export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Jane Doe',
      relationship: 'Spouse/Partner',
      phone: '+1 (555) 987-6543',
      email: 'jane.doe@email.com',
      address: '123 Main St, Anytown, ST 12345',
      isPrimary: true,
      canReceiveAlerts: true,
      availableHours: '24/7',
      medicalInfo: 'Knows all medical history and medications'
    },
    {
      id: '2',
      name: 'Dr. Sarah Johnson',
      relationship: 'Doctor',
      phone: '+1 (555) 123-4567',
      email: 'dr.johnson@clinic.com',
      isPrimary: false,
      canReceiveAlerts: true,
      availableHours: '9 AM - 5 PM Mon-Fri',
      medicalInfo: 'Primary care physician'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      relationship: 'Friend',
      phone: '+1 (555) 555-0123',
      email: 'mike.j@email.com',
      isPrimary: false,
      canReceiveAlerts: false,
      availableHours: 'Evenings and weekends',
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<EmergencyContact>>({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    address: '',
    isPrimary: false,
    canReceiveAlerts: true,
    availableHours: '24/7',
    medicalInfo: ''
  });

  useEffect(() => {
    // Load contacts from localStorage
    const saved = localStorage.getItem('emergency-contacts');
    if (saved) {
      setContacts(JSON.parse(saved));
    }
  }, []);

  const saveToStorage = (updatedContacts: EmergencyContact[]) => {
    localStorage.setItem('emergency-contacts', JSON.stringify(updatedContacts));
  };

  const handleAdd = () => {
    if (!formData.name || !formData.relationship || !formData.phone) return;

    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: formData.name!,
      relationship: formData.relationship!,
      phone: formData.phone!,
      email: formData.email || undefined,
      address: formData.address || undefined,
      isPrimary: formData.isPrimary || false,
      canReceiveAlerts: formData.canReceiveAlerts ?? true,
      availableHours: formData.availableHours || '24/7',
      medicalInfo: formData.medicalInfo || undefined
    };

    // If this is set as primary, remove primary from others
    let updatedContacts = contacts;
    if (newContact.isPrimary) {
      updatedContacts = contacts.map(c => ({ ...c, isPrimary: false }));
    }

    const finalContacts = [...updatedContacts, newContact];
    setContacts(finalContacts);
    saveToStorage(finalContacts);
    
    // Reset form
    setFormData({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      address: '',
      isPrimary: false,
      canReceiveAlerts: true,
      availableHours: '24/7',
      medicalInfo: ''
    });
    setIsAdding(false);
  };

  const handleEdit = (contact: EmergencyContact) => {
    setFormData(contact);
    setEditingId(contact.id);
  };

  const handleUpdate = () => {
    if (!editingId || !formData.name || !formData.relationship || !formData.phone) return;

    let updatedContacts = contacts.map(contact => 
      contact.id === editingId 
        ? { ...contact, ...formData } as EmergencyContact
        : contact
    );

    // If this is set as primary, remove primary from others
    if (formData.isPrimary) {
      updatedContacts = updatedContacts.map(c => 
        c.id === editingId 
          ? c 
          : { ...c, isPrimary: false }
      );
    }

    setContacts(updatedContacts);
    saveToStorage(updatedContacts);
    setEditingId(null);
    setFormData({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      address: '',
      isPrimary: false,
      canReceiveAlerts: true,
      availableHours: '24/7',
      medicalInfo: ''
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this emergency contact?')) {
      const updatedContacts = contacts.filter(c => c.id !== id);
      setContacts(updatedContacts);
      saveToStorage(updatedContacts);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      address: '',
      isPrimary: false,
      canReceiveAlerts: true,
      availableHours: '24/7',
      medicalInfo: ''
    });
  };

  const primaryContact = contacts.find(c => c.isPrimary);
  const secondaryContacts = contacts.filter(c => !c.isPrimary);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Emergency Contacts</h1>
              <p className="text-gray-600 mt-1">Manage your emergency contact information</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-red-100 text-red-800">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Critical Information
              </Badge>
              <Button
                onClick={() => setIsAdding(true)}
                disabled={isAdding || editingId}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Contact
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Emergency Information Banner */}
        <Card className="mb-8 bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500 rounded-full">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Emergency Protocols</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-semibold text-red-800">Life-threatening Emergency</p>
                    <p className="text-red-700">Call 911 immediately</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-semibold text-red-800">Primary Contact</p>
                    <p className="text-red-700">{primaryContact?.name || 'None set'}</p>
                    <p className="text-red-700">{primaryContact?.phone || ''}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-semibold text-red-800">Medical Info Location</p>
                    <p className="text-red-700">Account → Medical History</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact List */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Emergency Contacts</h2>
              
              {/* Primary Contact */}
              {primaryContact && (
                <Card className="mb-4 border-2 border-red-200 bg-red-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-red-900 flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        Primary Emergency Contact
                      </CardTitle>
                      <Badge className="bg-red-500 text-white">PRIMARY</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg text-red-900">{primaryContact.name}</h3>
                        <p className="text-red-700">{primaryContact.relationship}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-red-600" />
                          <span>{primaryContact.phone}</span>
                        </div>
                        {primaryContact.email && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-red-600" />
                            <span>{primaryContact.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-red-600" />
                          <span>{primaryContact.availableHours}</span>
                        </div>
                        {primaryContact.canReceiveAlerts && (
                          <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-red-600" />
                            <span>Receives alerts</span>
                          </div>
                        )}
                      </div>

                      {primaryContact.medicalInfo && (
                        <div className="p-2 bg-white rounded border">
                          <p className="text-sm text-gray-700">{primaryContact.medicalInfo}</p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(primaryContact)}
                          disabled={isAdding || editingId}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDelete(primaryContact.id)}
                          disabled={isAdding || editingId}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Secondary Contacts */}
              <div className="space-y-4">
                {secondaryContacts.map((contact) => (
                  <Card key={contact.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                            <Badge variant="outline">{contact.relationship}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{contact.phone}</span>
                            </div>
                            {contact.email && (
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{contact.email}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{contact.availableHours}</span>
                            </div>
                            {contact.canReceiveAlerts && (
                              <div className="flex items-center gap-2">
                                <Bell className="w-4 h-4" />
                                <span>Receives alerts</span>
                              </div>
                            )}
                          </div>

                          {contact.medicalInfo && (
                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              {contact.medicalInfo}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEdit(contact)}
                            disabled={isAdding || editingId}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDelete(contact.id)}
                            disabled={isAdding || editingId}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {contacts.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Emergency Contacts</h3>
                    <p className="text-gray-600 mb-4">Add emergency contacts to ensure help can reach you quickly</p>
                    <Button onClick={() => setIsAdding(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Contact
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Add/Edit Form */}
          <div>
            <AnimatePresence>
              {(isAdding || editingId) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {editingId ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter full name"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="relationship">Relationship *</Label>
                        <Select 
                          value={formData.relationship || ''} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            {RELATIONSHIPS.map(rel => (
                              <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+1 (555) 123-4567"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email (Optional)</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="email@example.com"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="hours">Available Hours</Label>
                        <Select 
                          value={formData.availableHours || '24/7'} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, availableHours: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="24/7">24/7</SelectItem>
                            <SelectItem value="9 AM - 5 PM Mon-Fri">9 AM - 5 PM Mon-Fri</SelectItem>
                            <SelectItem value="Evenings and weekends">Evenings and weekends</SelectItem>
                            <SelectItem value="Daytime only">Daytime only</SelectItem>
                            <SelectItem value="Emergency only">Emergency only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="medicalInfo">Medical Information (Optional)</Label>
                        <Input
                          id="medicalInfo"
                          value={formData.medicalInfo || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, medicalInfo: e.target.value }))}
                          placeholder="e.g., Knows medical history, has spare medications"
                          className="mt-1"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="isPrimary"
                            checked={formData.isPrimary || false}
                            onChange={(e) => setFormData(prev => ({ ...prev, isPrimary: e.target.checked }))}
                            className="w-4 h-4 text-blue-600"
                          />
                          <Label htmlFor="isPrimary">Set as primary emergency contact</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="canReceiveAlerts"
                            checked={formData.canReceiveAlerts ?? true}
                            onChange={(e) => setFormData(prev => ({ ...prev, canReceiveAlerts: e.target.checked }))}
                            className="w-4 h-4 text-blue-600"
                          />
                          <Label htmlFor="canReceiveAlerts">Can receive emergency alerts</Label>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={editingId ? handleUpdate : handleAdd}
                          disabled={!formData.name || !formData.relationship || !formData.phone}
                          className="flex-1"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {editingId ? 'Update Contact' : 'Add Contact'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          className="flex-1"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}