import { PrismaClient, ResourceType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Sample resources for demonstration
  const resources = [
    {
      name: "City General Hospital",
      type: ResourceType.HOSPITAL,
      address: "123 Main Street, Anytown, CA 12345",
      phone: "(555) 123-4567",
      website: "https://citygeneralhospital.com",
      zipCode: "12345",
      city: "Anytown",
      state: "CA",
      hours: JSON.stringify({ "24/7": true }),
      cost: "Emergency visits typically $500-2000"
    },
    {
      name: "Community Health Clinic",
      type: ResourceType.CLINIC,
      address: "456 Oak Avenue, Anytown, CA 12345",
      phone: "(555) 234-5678",
      website: "https://communityhealthclinic.org",
      zipCode: "12345",
      city: "Anytown",
      state: "CA",
      hours: JSON.stringify({ 
        "Monday-Friday": "8:00 AM - 6:00 PM",
        "Saturday": "9:00 AM - 2:00 PM"
      }),
      cost: "Sliding scale fees, insurance accepted"
    },
    {
      name: "24/7 Pharmacy Plus",
      type: ResourceType.PHARMACY,
      address: "789 Elm Street, Anytown, CA 12345",
      phone: "(555) 345-6789",
      zipCode: "12345",
      city: "Anytown",
      state: "CA",
      hours: JSON.stringify({ "24/7": true }),
      cost: "Insurance accepted, generic options available"
    },
    {
      name: "National Suicide Prevention Lifeline",
      type: ResourceType.HOTLINE,
      phone: "988",
      website: "https://suicidepreventionlifeline.org",
      country: "US",
      hours: JSON.stringify({ "24/7": true }),
      cost: "Free"
    },
    {
      name: "Crisis Text Line",
      type: ResourceType.HOTLINE,
      phone: "Text HOME to 741741",
      website: "https://crisistextline.org",
      country: "US",
      hours: JSON.stringify({ "24/7": true }),
      cost: "Free"
    },
    {
      name: "Mindful Therapy Center",
      type: ResourceType.MENTAL_HEALTH,
      address: "321 Pine Street, Anytown, CA 12345",
      phone: "(555) 456-7890",
      website: "https://mindfultherapycenter.com",
      zipCode: "12345",
      city: "Anytown",
      state: "CA",
      hours: JSON.stringify({
        "Monday-Thursday": "9:00 AM - 8:00 PM",
        "Friday": "9:00 AM - 5:00 PM",
        "Saturday": "10:00 AM - 3:00 PM"
      }),
      cost: "Insurance accepted, sliding scale available"
    }
  ];

  for (const resource of resources) {
    await prisma.resource.create({
      data: resource
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })