"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AccessibleCardProps extends React.ComponentProps<typeof Card> {
  title?: string;
  description?: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  role?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  interactive?: boolean;
  onActivate?: () => void;
}

export function AccessibleCard({
  title,
  description,
  headingLevel = 'h3',
  role,
  ariaLabel,
  ariaDescribedBy,
  interactive = false,
  onActivate,
  children,
  className,
  ...props
}: AccessibleCardProps) {
  const HeadingTag = headingLevel;
  
  const handleClick = () => {
    if (interactive && onActivate) {
      onActivate();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (interactive && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onActivate?.();
    }
  };

  return (
    <Card
      className={cn(
        // Ensure sufficient color contrast
        'bg-white border-gray-200 shadow-sm',
        // Interactive states
        interactive && [
          'cursor-pointer transition-all duration-200',
          'hover:shadow-md hover:border-gray-300',
          'focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2',
          'active:scale-[0.99]'
        ],
        className
      )}
      role={role || (interactive ? 'button' : undefined)}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? handleClick : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      {...props}
    >
      {(title || description) && (
        <CardHeader className="pb-4">
          {title && (
            <CardTitle asChild>
              <HeadingTag className="text-lg font-semibold text-gray-900 leading-tight">
                {title}
              </HeadingTag>
            </CardTitle>
          )}
          {description && (
            <CardDescription className="text-sm text-gray-600 mt-1">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      
      <CardContent className={cn(title || description ? 'pt-0' : 'pt-6')}>
        {children}
      </CardContent>
    </Card>
  );
}

interface HealthMetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  status: 'normal' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  description?: string;
  icon?: React.ReactNode;
  onViewDetails?: () => void;
}

export function HealthMetricCard({
  title,
  value,
  unit,
  status,
  trend,
  description,
  icon,
  onViewDetails,
}: HealthMetricCardProps) {
  const statusStyles = {
    normal: 'text-green-700 bg-green-50 border-green-200',
    warning: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    critical: 'text-red-700 bg-red-50 border-red-200',
  };

  const statusIcons = {
    normal: '✓',
    warning: '⚠',
    critical: '🚨',
  };

  const trendIcons = {
    up: '↗',
    down: '↘',
    stable: '→',
  };

  const statusClass = `risk-${status === 'normal' ? 'low' : status === 'warning' ? 'moderate' : 'critical'}`;

  return (
    <AccessibleCard
      className={cn('transition-all duration-200', statusStyles[status])}
      interactive={!!onViewDetails}
      onActivate={onViewDetails}
      role={onViewDetails ? 'button' : undefined}
      ariaLabel={`${title}: ${value}${unit ? ` ${unit}` : ''}, status: ${status}${trend ? `, trend: ${trend}` : ''}${onViewDetails ? ', click for details' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {icon && (
            <div className="flex-shrink-0 mt-1" aria-hidden="true">
              {icon}
            </div>
          )}
          
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900">
              {title}
            </h3>
            
            <div className="mt-2 flex items-baseline space-x-2">
              <span 
                className="text-2xl font-bold text-gray-900"
                aria-label={`Value: ${value}${unit ? ` ${unit}` : ''}`}
              >
                {value}
                {unit && (
                  <span className="text-sm font-normal text-gray-600 ml-1">
                    {unit}
                  </span>
                )}
              </span>
              
              {trend && (
                <span 
                  className="text-sm text-gray-500"
                  aria-label={`Trend: ${trend}`}
                >
                  {trendIcons[trend]}
                </span>
              )}
            </div>
            
            {description && (
              <p className="mt-1 text-sm text-gray-600">
                {description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <span 
            className={cn(statusClass, 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium')}
            aria-label={`Health status: ${status}`}
            role="status"
          >
            <span aria-hidden="true" className="mr-1">
              {statusIcons[status]}
            </span>
            {status}
          </span>
        </div>
      </div>
      
      {onViewDetails && (
        <div className="mt-4 pt-4 border-t border-current/10">
          <span className="text-sm text-current/70 flex items-center">
            View details
            <span aria-hidden="true" className="ml-1">→</span>
          </span>
        </div>
      )}
    </AccessibleCard>
  );
}

interface AccessibleFeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: string;
  disabled?: boolean;
  className?: string;
}

export function AccessibleFeatureCard({
  title,
  description,
  icon,
  href,
  onClick,
  badge,
  disabled = false,
  className,
}: AccessibleFeatureCardProps) {
  const interactive = !disabled && (href || onClick);
  
  const content = (
    <AccessibleCard
      className={cn(
        'h-full transition-all duration-200',
        interactive && 'hover:shadow-lg hover:border-blue-300',
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
      interactive={interactive}
      onActivate={onClick}
      ariaLabel={`${title}. ${description}${badge ? `. ${badge}` : ''}${disabled ? '. Currently disabled' : ''}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          {icon && (
            <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg" aria-hidden="true">
              {icon}
            </div>
          )}
          
          {badge && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {badge}
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
        
        {interactive && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-blue-600 font-medium flex items-center">
              Learn more
              <span aria-hidden="true" className="ml-1">→</span>
            </span>
          </div>
        )}
        
        {disabled && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500 flex items-center">
              <span aria-hidden="true" className="mr-1">⏸</span>
              Coming soon
            </span>
          </div>
        )}
      </div>
    </AccessibleCard>
  );

  if (href && !disabled) {
    return (
      <a 
        href={href}
        className="block h-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-lg"
        tabIndex={0}
      >
        {content}
      </a>
    );
  }

  return content;
}