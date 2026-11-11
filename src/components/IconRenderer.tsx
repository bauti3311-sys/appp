import React from 'react';
import * as Icons from 'lucide-react';

interface IconRendererProps {
  name?: string;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name = 'Command', className = 'w-5 h-5', size = 20 }) => {
  // Map commonly used custom names
  const safeName = name || 'Command';
  const LucideIcon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string; size?: number }>>)[safeName] || Icons.Command;

  return <LucideIcon className={className} size={size} />;
};
