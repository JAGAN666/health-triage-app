/**
 * HealthTriage AI Design System Exports
 * Centralized exports for consistent component usage
 */

// Design System
export { designSystem, getFeatureColor, getRiskLevelStyle, createGradient } from '@/styles/design-system';
export type { DesignSystem } from '@/styles/design-system';

// Healthcare Components
export {
  HealthcareFeatureCard,
  RiskLevelBadge,
  MedicalStatus,
  ProfessionalHeader,
  HealthcareMetric,
  HealthcareButton,
} from './healthcare-components';

// Healthcare Animations
export {
  animationVariants,
  HealthcareSpinner,
  MedicalPulse,
  AnimatedCounter,
  HealthcareProgress,
  HealthcareToast,
  AnimatedHealthcareIcon,
  SectionReveal,
} from './healthcare-animations';

// Existing UI Components
export { Button } from './button';
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
export { Badge } from './badge';
export { Input } from './input';
export { Label } from './label';
export { Textarea } from './textarea';
export { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

// Loading Component
export { default as Loading } from './loading';