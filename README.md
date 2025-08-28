# 🏥 HealthTriage AI

> **Your trusted AI-powered health companion** - Built for Bay2BayHacks 2025

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-green)](https://openai.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Overview

HealthTriage AI is a comprehensive health companion that provides AI-powered symptom assessment, mental health support, and healthcare resource discovery. Built to address the critical gap where **40% of people delay medical care** due to uncertainty, cost, or access barriers.

### 🎯 Hackathon: Bay2BayHacks 2025
- **Theme**: AI for Societal Good
- **Duration**: 7 days (August 23-29, 2025)
- **Prize Pool**: $32,518 in cash

## ✨ Features

### 🔍 **AI Health Triage**
- Intelligent symptom analysis with risk stratification (Low, Medium, High)
- Clear rationale and personalized action plans
- Emergency escalation for high-risk situations
- WhatsApp-style chat interface with streaming responses

### 🧠 **Mental Health Support**
- Daily mood tracking with 5-point emotional scale
- Personalized coping strategies and breathing exercises
- Crisis intervention with immediate hotline access
- Progress tracking and trend analysis

### 📍 **Healthcare Resource Finder**
- Location-based search for clinics, hospitals, pharmacies
- Real-time availability and contact information
- Direct calling and directions integration
- Filter by type, open hours, and distance

### 📊 **Health History Management**
- Secure session storage and tracking
- PDF export for healthcare provider visits
- Search and filter past assessments
- Privacy-focused data management

## 🛠️ Tech Stack

**Frontend:** Next.js 15, TypeScript, Tailwind CSS, Shadcn/ui, React
**Backend:** Next.js API Routes, OpenAI GPT-4, Prisma, SQLite
**Deployment:** Vercel (optimized for Next.js)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone and install**
   ```bash
   git clone https://github.com/yourusername/health-triage-app.git
   cd health-triage-app
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.local.example .env.local
   ```
   Add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Initialize database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the application.

## 🔑 Demo Credentials

Use these credentials to test the application:

### Patient Account (Demo User)
- **Email:** `demo@healthtriage.ai`
- **Password:** `demo123`
- **Role:** Patient
- **Features:** AI health triage, symptom checker, vital signs monitoring, telehealth booking

### Doctor Account (Dr. Sarah Johnson)
- **Email:** `doctor@healthtriage.ai`
- **Password:** `doctor123`
- **Role:** Healthcare Provider
- **Features:** Patient management, telemedicine consultations, population health analytics

Both accounts provide full access to their respective features and demonstrate the complete healthcare workflow from patient and provider perspectives.

## 🔒 Privacy & Security

- **Local-first storage** for sensitive health data
- **Encryption** for all data transmission  
- **No tracking** or advertising
- **User-controlled data deletion**

## 📈 Impact

**Problem:** 40% of people delay medical care due to barriers
**Solution:** AI-powered triage + resource connection + mental health support
**Result:** Better healthcare access and earlier intervention

## ⚠️ Medical Disclaimer

HealthTriage AI is for informational purposes only and is **NOT** a substitute for professional medical advice. Always consult healthcare professionals for medical decisions. **In emergencies, call 911 immediately.**

---

**Built with ❤️ for Bay2BayHacks 2025**
