import React from 'react';
import {
  UtensilsCrossed,
  Castle,
  Apple,
  ShieldCheck,
  Crown,
  Sun,
  School,
  Sparkles,
} from 'lucide-react';
import { LOGO_PRESETS } from '../data/defaultData';

interface LogoRendererProps {
  logoUrl: string;
  logoType: 'preset' | 'custom';
  altText?: string;
  className?: string;
  iconSize?: number;
}

export const LogoRenderer: React.FC<LogoRendererProps> = ({
  logoUrl,
  logoType,
  altText = 'Logo',
  className = 'w-16 h-16',
  iconSize = 32,
}) => {
  if (
    logoType === 'custom' &&
    logoUrl &&
    (logoUrl.startsWith('data:') || logoUrl.startsWith('http') || logoUrl.startsWith('/') || logoUrl.includes('/assets/'))
  ) {
    return (
      <div className={`${className} rounded-full overflow-hidden shadow-sm border-2 border-amber-300/80 bg-white flex items-center justify-center shrink-0 relative`}>
        <img
          src={logoUrl}
          alt={altText}
          className="w-full h-full object-cover scale-[1.18]"
        />
      </div>
    );
  }

  // Preset match
  const preset = LOGO_PRESETS.find((p) => p.id === logoUrl) || LOGO_PRESETS[0];

  if (preset && preset.imageUrl) {
    return (
      <div className={`${className} rounded-full overflow-hidden shadow-sm border-2 border-amber-300/80 bg-white flex items-center justify-center shrink-0 relative`}>
        <img
          src={preset.imageUrl}
          alt={altText || preset.name}
          className="w-full h-full object-cover scale-[1.18]"
        />
      </div>
    );
  }

  const renderPresetIcon = () => {
    switch (preset.id) {
      case 'chef-erika':
        return <UtensilsCrossed size={iconSize} className={preset.textColorClass} />;
      case 'castle-school':
        return <Castle size={iconSize} className={preset.textColorClass} />;
      case 'apple-mascot':
        return <Apple size={iconSize} className={preset.textColorClass} />;
      case 'nutrition-shield':
        return <ShieldCheck size={iconSize} className={preset.textColorClass} />;
      case 'catering-crown':
        return <Crown size={iconSize} className={preset.textColorClass} />;
      case 'baby-sun':
        return <Sun size={iconSize} className={preset.textColorClass} />;
      default:
        return <School size={iconSize} className="text-amber-600" />;
    }
  };

  return (
    <div
      className={`${className} ${preset.bgClass} border-2 rounded-full flex items-center justify-center shadow-sm relative overflow-hidden transition-all`}
      title={preset.name}
    >
      {renderPresetIcon()}
    </div>
  );
};
