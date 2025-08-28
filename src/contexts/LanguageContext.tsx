"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'es' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation files - in a production app, these would be in separate JSON files
const translations = {
  en: {
    // Navigation & General
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.triage': 'AI Triage',
    'nav.visual': 'Visual Analysis',
    'nav.vitals': 'Vital Signs',
    'nav.emergency': 'Emergency',
    'nav.back': 'Back to Home',
    
    // Homepage
    'home.title': 'AI Health Triage',
    'home.subtitle': 'Advanced multimodal AI health assistant for comprehensive symptom analysis and medical guidance',
    'home.start': 'Start Health Assessment',
    'home.features.title': 'Comprehensive AI Health Features',
    'home.features.triage': 'AI Chat Triage',
    'home.features.triage.desc': 'Intelligent symptom assessment with personalized recommendations',
    'home.features.visual': 'Visual Analysis',
    'home.features.visual.desc': 'AI-powered medical image analysis using computer vision',
    'home.features.vitals': 'Vital Signs',
    'home.features.vitals.desc': 'Smartphone-based heart rate monitoring with real PPG algorithms',
    'home.features.emergency': 'Emergency Detection',
    'home.features.emergency.desc': 'Automated emergency situation detection and response coordination',
    
    // Triage
    'triage.title': 'AI Health Triage',
    'triage.subtitle': 'Describe your symptoms for personalized AI health guidance',
    'triage.placeholder': 'Describe your symptoms...',
    'triage.send': 'Send',
    'triage.disclaimer': '⚠️ **Important Limitations**:\n• This is NOT medical advice or diagnosis\n• AI assessments may be incomplete or incorrect\n• Cannot replace professional medical evaluation\n• In emergencies, call 911 immediately\n• Confidence scores show AI certainty, not medical accuracy',
    'triage.greeting': 'Hello! I\'m your AI health triage assistant. I can help assess your symptoms and provide guidance on next steps. Please describe what you\'re experiencing.',
    
    // Risk Assessment
    'risk.low': 'Low Risk',
    'risk.medium': 'Medium Risk', 
    'risk.high': 'High Risk',
    'risk.emergency': 'EMERGENCY SITUATION DETECTED',
    'risk.emergency.desc': 'Based on your symptoms, you should seek emergency care immediately',
    'risk.confidence': 'AI Assessment Confidence',
    'risk.confidence.high': 'High confidence in this assessment based on provided symptoms.',
    'risk.confidence.moderate': 'Moderate confidence. Additional information may improve accuracy.',
    'risk.confidence.low': 'Lower confidence due to limited or ambiguous symptom information. Consider providing more details or seeking professional evaluation.',
    
    // Visual Analysis
    'visual.title': 'AI Visual Analysis',
    'visual.subtitle': 'Upload images for AI-powered medical visual analysis using advanced computer vision',
    'visual.upload': 'Upload Image',
    'visual.camera': 'Take Photo',
    'visual.analyze': 'Analyze with AI Vision',
    'visual.analyzing': 'Analyzing with AI...',
    'visual.describe': 'Describe what you\'re experiencing (optional)',
    'visual.placeholder': 'e.g., \'Rash appeared 2 days ago, itchy and red\'',
    'visual.disclaimer': 'This AI visual analysis uses GPT-4V computer vision but has significant limitations:',
    'visual.limitations': [
      'Cannot replace dermatologist or physician examination',
      'May miss subtle signs or misinterpret common conditions',
      'Confidence scores reflect AI certainty, not medical accuracy',
      'Cannot diagnose internal conditions from external images',
      'Always seek professional medical evaluation for health concerns'
    ],
    
    // Vital Signs
    'vitals.title': 'Vital Signs Monitor',
    'vitals.subtitle': 'Real photoplethysmography (PPG) implementation using smartphone camera with advanced signal processing algorithms',
    'vitals.start': 'Start Vital Signs Monitoring',
    'vitals.instructions': 'Instructions',
    'vitals.step1': 'Cover rear camera completely with your fingertip',
    'vitals.step2': 'Keep your finger still for 30 seconds',
    'vitals.step3': 'Breathe normally and remain relaxed',
    'vitals.heartrate': 'Heart Rate',
    'vitals.breathing': 'Breathing Rate',
    'vitals.hrv': 'Heart Rate Variability',
    'vitals.stress': 'Overall Assessment',
    'vitals.notmeasurable': 'Not measurable via smartphone camera',
    'vitals.advanced': 'Requires advanced PPG analysis',
    'vitals.normal.hr': 'BPM (Normal: 60-100)',
    'vitals.normal.br': 'per min (Normal: 12-20)',
    'vitals.normal.hrv': 'ms (Higher is better)',
    
    // Emergency
    'emergency.title': 'Emergency Detection AI',
    'emergency.subtitle': 'Advanced AI system that automatically detects medical emergencies and coordinates immediate response',
    'emergency.demo': 'Emergency Detection Demo',
    'emergency.critical': 'CRITICAL Emergency',
    'emergency.high': 'HIGH Risk Detection',
    'emergency.calling': 'Calling Emergency Services...',
    'emergency.contacts': 'Contacting Emergency Contacts...',
    'emergency.resolved': 'Emergency Response Activated',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.close': 'Close',
    'common.cancel': 'Cancel',
    'common.continue': 'Continue',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.confidence': 'Confidence'
  },
  
  es: {
    // Navigation & General
    'nav.home': 'Inicio',
    'nav.dashboard': 'Panel',
    'nav.triage': 'Triaje IA',
    'nav.visual': 'Análisis Visual',
    'nav.vitals': 'Signos Vitales',
    'nav.emergency': 'Emergencia',
    'nav.back': 'Volver al Inicio',
    
    // Homepage
    'home.title': 'Triaje de Salud IA',
    'home.subtitle': 'Asistente avanzado de salud con IA multimodal para análisis integral de síntomas y orientación médica',
    'home.start': 'Iniciar Evaluación de Salud',
    'home.features.title': 'Características Integrales de Salud IA',
    'home.features.triage': 'Triaje con Chat IA',
    'home.features.triage.desc': 'Evaluación inteligente de síntomas con recomendaciones personalizadas',
    'home.features.visual': 'Análisis Visual',
    'home.features.visual.desc': 'Análisis de imágenes médicas con IA usando visión por computadora',
    'home.features.vitals': 'Signos Vitales',
    'home.features.vitals.desc': 'Monitoreo de ritmo cardíaco basado en smartphone con algoritmos PPG reales',
    'home.features.emergency': 'Detección de Emergencias',
    'home.features.emergency.desc': 'Detección automatizada de situaciones de emergencia y coordinación de respuesta',
    
    // Triage
    'triage.title': 'Triaje de Salud IA',
    'triage.subtitle': 'Describe tus síntomas para recibir orientación personalizada de salud con IA',
    'triage.placeholder': 'Describe tus síntomas...',
    'triage.send': 'Enviar',
    'triage.disclaimer': '⚠️ **Limitaciones Importantes**:\n• Esto NO es consejo médico ni diagnóstico\n• Las evaluaciones de IA pueden ser incompletas o incorrectas\n• No puede reemplazar la evaluación médica profesional\n• En emergencias, llama al 911 inmediatamente\n• Las puntuaciones de confianza muestran certeza de IA, no precisión médica',
    'triage.greeting': '¡Hola! Soy tu asistente de triaje de salud IA. Puedo ayudar a evaluar tus síntomas y proporcionar orientación sobre los próximos pasos. Por favor describe lo que estás experimentando.',
    
    // Risk Assessment
    'risk.low': 'Riesgo Bajo',
    'risk.medium': 'Riesgo Medio',
    'risk.high': 'Riesgo Alto',
    'risk.emergency': 'SITUACIÓN DE EMERGENCIA DETECTADA',
    'risk.emergency.desc': 'Basado en tus síntomas, deberías buscar atención de emergencia inmediatamente',
    'risk.confidence': 'Confianza de Evaluación IA',
    'risk.confidence.high': 'Alta confianza en esta evaluación basada en los síntomas proporcionados.',
    'risk.confidence.moderate': 'Confianza moderada. Información adicional puede mejorar la precisión.',
    'risk.confidence.low': 'Menor confianza debido a información de síntomas limitada o ambigua. Considera proporcionar más detalles o buscar evaluación profesional.',
    
    // Visual Analysis
    'visual.title': 'Análisis Visual IA',
    'visual.subtitle': 'Sube imágenes para análisis visual médico con IA usando visión por computadora avanzada',
    'visual.upload': 'Subir Imagen',
    'visual.camera': 'Tomar Foto',
    'visual.analyze': 'Analizar con Visión IA',
    'visual.analyzing': 'Analizando con IA...',
    'visual.describe': 'Describe lo que estás experimentando (opcional)',
    'visual.placeholder': 'ej., \'Erupción apareció hace 2 días, con picazón y roja\'',
    'visual.disclaimer': 'Este análisis visual IA usa visión por computadora GPT-4V pero tiene limitaciones significativas:',
    'visual.limitations': [
      'No puede reemplazar el examen de dermatólogo o médico',
      'Puede pasar por alto señales sutiles o malinterpretar condiciones comunes',
      'Las puntuaciones de confianza reflejan certeza de IA, no precisión médica',
      'No puede diagnosticar condiciones internas desde imágenes externas',
      'Siempre busca evaluación médica profesional para preocupaciones de salud'
    ],
    
    // Vital Signs
    'vitals.title': 'Monitor de Signos Vitales',
    'vitals.subtitle': 'Implementación real de fotopletismografía (PPG) usando cámara de smartphone con algoritmos avanzados de procesamiento de señales',
    'vitals.start': 'Iniciar Monitoreo de Signos Vitales',
    'vitals.instructions': 'Instrucciones',
    'vitals.step1': 'Cubre completamente la cámara trasera con la punta del dedo',
    'vitals.step2': 'Mantén el dedo quieto durante 30 segundos',
    'vitals.step3': 'Respira normalmente y mantente relajado',
    'vitals.heartrate': 'Ritmo Cardíaco',
    'vitals.breathing': 'Frecuencia Respiratoria',
    'vitals.hrv': 'Variabilidad del Ritmo Cardíaco',
    'vitals.stress': 'Evaluación General',
    'vitals.notmeasurable': 'No medible a través de cámara de smartphone',
    'vitals.advanced': 'Requiere análisis PPG avanzado',
    'vitals.normal.hr': 'LPM (Normal: 60-100)',
    'vitals.normal.br': 'por min (Normal: 12-20)',
    'vitals.normal.hrv': 'ms (Más alto es mejor)',
    
    // Emergency
    'emergency.title': 'IA de Detección de Emergencias',
    'emergency.subtitle': 'Sistema avanzado de IA que detecta automáticamente emergencias médicas y coordina respuesta inmediata',
    'emergency.demo': 'Demo de Detección de Emergencias',
    'emergency.critical': 'Emergencia CRÍTICA',
    'emergency.high': 'Detección de Riesgo ALTO',
    'emergency.calling': 'Llamando a Servicios de Emergencia...',
    'emergency.contacts': 'Contactando Contactos de Emergencia...',
    'emergency.resolved': 'Respuesta de Emergencia Activada',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.close': 'Cerrar',
    'common.cancel': 'Cancelar',
    'common.continue': 'Continuar',
    'common.save': 'Guardar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.confidence': 'Confianza'
  },
  
  hi: {
    // Navigation & General
    'nav.home': 'होम',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.triage': 'AI ट्राइएज',
    'nav.visual': 'विजुअल एनालिसिस',
    'nav.vitals': 'वाइटल साइन्स',
    'nav.emergency': 'इमरजेंसी',
    'nav.back': 'होम पर वापस जाएं',
    
    // Homepage
    'home.title': 'AI हेल्थ ट्राइएज',
    'home.subtitle': 'व्यापक लक्षण विश्लेषण और चिकित्सा मार्गदर्शन के लिए उन्नत मल्टीमोडल AI स्वास्थ्य सहायक',
    'home.start': 'स्वास्थ्य मूल्यांकन शुरू करें',
    'home.features.title': 'व्यापक AI स्वास्थ्य सुविधाएं',
    'home.features.triage': 'AI चैट ट्राइएज',
    'home.features.triage.desc': 'व्यक्तिगत सिफारिशों के साथ बुद्धिमान लक्षण मूल्यांकन',
    'home.features.visual': 'विजुअल एनालिसिस',
    'home.features.visual.desc': 'कंप्यूटर विजन का उपयोग करके AI-संचालित चिकित्सा छवि विश्लेषण',
    'home.features.vitals': 'वाइटल साइन्स',
    'home.features.vitals.desc': 'वास्तविक PPG एल्गोरिदम के साथ स्मार्टफोन-आधारित हृदय गति निगरानी',
    'home.features.emergency': 'इमरजेंसी डिटेक्शन',
    'home.features.emergency.desc': 'स्वचालित आपातकालीन स्थिति का पता लगाना और प्रतिक्रिया समन्वय',
    
    // Triage
    'triage.title': 'AI हेल्थ ट्राइएज',
    'triage.subtitle': 'व्यक्तिगत AI स्वास्थ्य मार्गदर्शन के लिए अपने लक्षणों का वर्णन करें',
    'triage.placeholder': 'अपने लक्षणों का वर्णन करें...',
    'triage.send': 'भेजें',
    'triage.disclaimer': '⚠️ **महत्वपूर्ण सीमाएं**:\n• यह चिकित्सा सलाह या निदान नहीं है\n• AI मूल्यांकन अधूरे या गलत हो सकते हैं\n• पेशेवर चिकित्सा मूल्यांकन की जगह नहीं ले सकता\n• आपातकाल में तुरंत 911 पर कॉल करें\n• विश्वास स्कोर AI निश्चितता दिखाते हैं, चिकित्सा सटीकता नहीं',
    'triage.greeting': 'नमस्ते! मैं आपका AI स्वास्थ्य ट्राइएज सहायक हूं। मैं आपके लक्षणों का आकलन करने और अगले कदमों पर मार्गदर्शन प्रदान करने में मदद कर सकता हूं। कृपया बताएं कि आप क्या अनुभव कर रहे हैं।',
    
    // Risk Assessment
    'risk.low': 'कम जोखिम',
    'risk.medium': 'मध्यम जोखिम',
    'risk.high': 'उच्च जोखिम',
    'risk.emergency': 'आपातकालीन स्थिति का पता चला',
    'risk.emergency.desc': 'आपके लक्षणों के आधार पर, आपको तुरंत आपातकालीन देखभाल लेनी चाहिए',
    'risk.confidence': 'AI मूल्यांकन विश्वास',
    'risk.confidence.high': 'प्रदान किए गए लक्षणों के आधार पर इस मूल्यांकन में उच्च विश्वास।',
    'risk.confidence.moderate': 'मध्यम विश्वास। अतिरिक्त जानकारी सटीकता में सुधार कर सकती है।',
    'risk.confidence.low': 'सीमित या अस्पष्ट लक्षण जानकारी के कारण कम विश्वास। अधिक विवरण प्रदान करने या पेशेवर मूल्यांकन लेने पर विचार करें।',
    
    // Visual Analysis
    'visual.title': 'AI विजुअल एनालिसिस',
    'visual.subtitle': 'उन्नत कंप्यूटर विजन का उपयोग करके AI-संचालित चिकित्सा दृश्य विश्लेषण के लिए छवियां अपलोड करें',
    'visual.upload': 'छवि अपलोड करें',
    'visual.camera': 'फोटो लें',
    'visual.analyze': 'AI विजन के साथ विश्लेषण करें',
    'visual.analyzing': 'AI के साथ विश्लेषण कर रहे हैं...',
    'visual.describe': 'आप जो अनुभव कर रहे हैं उसका वर्णन करें (वैकल्पिक)',
    'visual.placeholder': 'जैसे, \'दाने 2 दिन पहले दिखाई दिए, खुजली और लाल\'',
    'visual.disclaimer': 'यह AI विजुअल एनालिसिस GPT-4V कंप्यूटर विजन का उपयोग करता है लेकिन इसकी महत्वपूर्ण सीमाएं हैं:',
    'visual.limitations': [
      'त्वचा विशेषज्ञ या चिकित्सक की जांच की जगह नहीं ले सकता',
      'सूक्ष्म संकेतों को छोड़ सकता है या सामान्य स्थितियों की गलत व्याख्या कर सकता है',
      'विश्वास स्कोर AI निश्चितता को दर्शाते हैं, चिकित्सा सटीकता को नहीं',
      'बाहरी छवियों से आंतरिक स्थितियों का निदान नहीं कर सकता',
      'स्वास्थ्य चिंताओं के लिए हमेशा पेशेवर चिकित्सा मूल्यांकन लें'
    ],
    
    // Vital Signs
    'vitals.title': 'वाइटल साइन्स मॉनिटर',
    'vitals.subtitle': 'उन्नत सिग्नल प्रोसेसिंग एल्गोरिदम के साथ स्मार्टफोन कैमरा का उपयोग करके वास्तविक फोटोप्लेथिस्मोग्राफी (PPG) कार्यान्वयन',
    'vitals.start': 'वाइटल साइन्स मॉनिटरिंग शुरू करें',
    'vitals.instructions': 'निर्देश',
    'vitals.step1': 'अपनी उंगली की नोक से रियर कैमरा को पूरी तरह से ढकें',
    'vitals.step2': 'अपनी उंगली को 30 सेकंड तक स्थिर रखें',
    'vitals.step3': 'सामान्य रूप से सांस लें और आराम से रहें',
    'vitals.heartrate': 'हृदय गति',
    'vitals.breathing': 'श्वसन दर',
    'vitals.hrv': 'हृदय गति परिवर्तनशीलता',
    'vitals.stress': 'समग्र मूल्यांकन',
    'vitals.notmeasurable': 'स्मार्टफोन कैमरा के माध्यम से मापने योग्य नहीं',
    'vitals.advanced': 'उन्नत PPG विश्लेषण की आवश्यकता',
    'vitals.normal.hr': 'BPM (सामान्य: 60-100)',
    'vitals.normal.br': 'प्रति मिनट (सामान्य: 12-20)',
    'vitals.normal.hrv': 'ms (उच्चतर बेहतर है)',
    
    // Emergency
    'emergency.title': 'इमरजेंसी डिटेक्शन AI',
    'emergency.subtitle': 'उन्नत AI सिस्टम जो स्वचालित रूप से चिकित्सा आपातकाल का पता लगाता है और तत्काल प्रतिक्रिया का समन्वय करता है',
    'emergency.demo': 'इमरजेंसी डिटेक्शन डेमो',
    'emergency.critical': 'गंभीर आपातकाल',
    'emergency.high': 'उच्च जोखिम का पता लगाना',
    'emergency.calling': 'आपातकालीन सेवाओं को कॉल कर रहे हैं...',
    'emergency.contacts': 'आपातकालीन संपर्कों से संपर्क कर रहे हैं...',
    'emergency.resolved': 'आपातकालीन प्रतिक्रिया सक्रिय',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.close': 'बंद करें',
    'common.cancel': 'रद्द करें',
    'common.continue': 'जारी रखें',
    'common.save': 'सेव करें',
    'common.delete': 'डिलीट करें',
    'common.edit': 'संपादित करें',
    'common.confidence': 'विश्वास'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('health-triage-language') as Language;
    if (savedLanguage && ['en', 'es', 'hi'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('es')) {
        setLanguageState('es');
      } else if (browserLang.startsWith('hi')) {
        setLanguageState('hi');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('health-triage-language', lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language][key] || translations.en[key] || key;
    
    // Handle parameter substitution
    if (params && typeof translation === 'string') {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(value));
      });
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}