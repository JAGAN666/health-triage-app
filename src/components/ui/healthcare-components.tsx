/**
 * Healthcare-Themed Component Library
 * Consistent UI components for HealthTriage AI platform
 */

"use client";

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { designSystem, getFeatureColor, getRiskLevelStyle } from '@/styles/design-system';
import { LucideIcon, CheckCircle, AlertTriangle, AlertCircle, XCircle } from 'lucide-react';

// Healthcare Feature Card
interface HealthcareFeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  feature: 'triage' | 'telehealth' | 'emergency' | 'analytics';
  stats?: string;
  features?: string[];
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

export const HealthcareFeatureCard: React.FC<HealthcareFeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  feature,
  stats,
  features,
  href,
  className,
  children,
}) => {
  const featureColors = getFeatureColor(feature);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("group cursor-pointer", className)}
    >
      <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
          style={{ 
            background: `linear-gradient(135deg, ${featureColors.primary} 0%, ${featureColors.secondary} 100%)` 
          }}
        />
        
        <CardHeader className="relative z-10 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div 
              className="p-3 rounded-2xl shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${featureColors.primary} 0%, ${featureColors.primary}dd 100%)` 
              }}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
            {stats && (
              <Badge 
                variant="outline" 
                className="font-semibold"
                style={{ 
                  color: featureColors.primary,
                  borderColor: featureColors.secondary,
                  backgroundColor: featureColors.background 
                }}
              >
                {stats}
              </Badge>
            )}
          </div>
          
          <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10 space-y-4">
          <p className="text-gray-700 text-lg leading-relaxed">
            {description}
          </p>
          
          {features && features.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-600 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          )}
          
          {children}
          
          {href && (
            <Button 
              className="w-full mt-4 font-semibold py-3 rounded-xl transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${featureColors.primary} 0%, ${featureColors.primary}dd 100%)`,
                boxShadow: `0 4px 20px 0 ${featureColors.primary}40`
              }}
            >
              Explore {title}
              <motion.div
                className="ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Medical Risk Level Badge
interface RiskLevelBadgeProps {
  level: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
  showIcon?: boolean;
}

export const RiskLevelBadge: React.FC<RiskLevelBadgeProps> = ({
  level,
  className,
  showIcon = true,
}) => {
  const riskStyle = getRiskLevelStyle(level);
  
  const icons = {
    low: CheckCircle,
    medium: AlertTriangle,
    high: AlertCircle,
    critical: XCircle,
  };
  
  const Icon = icons[level];
  
  return (
    <Badge 
      className={cn(
        "flex items-center gap-1 px-3 py-1 font-semibold text-sm rounded-full border",
        className
      )}
      style={{
        color: riskStyle.color,
        backgroundColor: riskStyle.background,
        borderColor: riskStyle.border,
      }}
    >
      {showIcon && <Icon className="w-4 h-4" />}
      {level.toUpperCase()} RISK
    </Badge>
  );
};

// Medical Status Indicator
interface MedicalStatusProps {
  status: 'online' | 'offline' | 'monitoring' | 'alert';
  label?: string;
  showPulse?: boolean;
  className?: string;
}

export const MedicalStatus: React.FC<MedicalStatusProps> = ({
  status,
  label,
  showPulse = true,
  className,
}) => {
  const statusConfig = designSystem.medical.status[status];
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: statusConfig.color }}
        />
        {showPulse && statusConfig.pulse && (
          <motion.div
            className="absolute inset-0 w-3 h-3 rounded-full"
            style={{ backgroundColor: statusConfig.color }}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.7, 0, 0.7] 
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
      {label && (
        <span className="text-sm font-medium text-gray-700">
          {label}
        </span>
      )}
    </div>
  );
};

// Professional Header Component
interface ProfessionalHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: LucideIcon;
  className?: string;
}

export const ProfessionalHeader: React.FC<ProfessionalHeaderProps> = ({
  title,
  subtitle,
  badge,
  icon: Icon,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("text-center mb-16", className)}
    >
      <div className="flex items-center justify-center gap-4 mb-6">
        {Icon && (
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
            <Icon className="w-8 h-8 text-white" />
          </div>
        )}
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600">
            {title}
          </h1>
          {badge && (
            <Badge 
              variant="outline" 
              className="mt-2 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700"
            >
              {badge}
            </Badge>
          )}
        </div>
      </div>
      
      {subtitle && (
        <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

// Healthcare Metric Card
interface HealthcareMetricProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'stable';
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'red' | 'purple';
  className?: string;
}

export const HealthcareMetric: React.FC<HealthcareMetricProps> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color = 'blue',
  className,
}) => {
  const colorMap = {
    blue: designSystem.colors.features.triage,
    green: designSystem.colors.features.analytics,
    red: designSystem.colors.features.emergency,
    purple: designSystem.colors.features.telehealth,
  };
  
  const colors = colorMap[color];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={cn("group", className)}
    >
      <Card className="p-6 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div 
            className="p-3 rounded-xl shadow-sm"
            style={{ backgroundColor: colors.background }}
          >
            <Icon 
              className="w-6 h-6"
              style={{ color: colors.primary }}
            />
          </div>
          {change && (
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs font-semibold",
                trend === 'up' && "text-green-700 border-green-200 bg-green-50",
                trend === 'down' && "text-red-700 border-red-200 bg-red-50",
                trend === 'stable' && "text-gray-700 border-gray-200 bg-gray-50"
              )}
            >
              {change}
            </Badge>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
            {value}
          </p>
          <p className="text-sm font-medium text-gray-600">
            {title}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

// Professional Button with Healthcare Theme
interface HealthcareButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'medical' | 'emergency' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const HealthcareButton: React.FC<HealthcareButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  disabled = false,
  className,
  ...props
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl",
    medical: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl",
    emergency: "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl",
    outline: "border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 bg-white/60 backdrop-blur-sm hover:bg-white/80",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm rounded-xl",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl",
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex items-center justify-center gap-2 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      ) : (
        Icon && <Icon className="w-5 h-5" />
      )}
      {children}
    </motion.button>
  );
};

export default {
  HealthcareFeatureCard,
  RiskLevelBadge,
  MedicalStatus,
  ProfessionalHeader,
  HealthcareMetric,
  HealthcareButton,
};