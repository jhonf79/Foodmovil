import React from 'react';
import { WeeklyMenu } from '../types';
import { SchoolFunTemplate } from './templates/SchoolFunTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { HealthyTemplate } from './templates/HealthyTemplate';
import { BoutiqueTemplate } from './templates/BoutiqueTemplate';
import { PastelTemplate } from './templates/PastelTemplate';
import { GridExecutiveTemplate } from './templates/GridExecutiveTemplate';

interface TemplateRendererProps {
  menu: WeeklyMenu;
  onEditCell?: (dayId: string, colId: string) => void;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ menu, onEditCell }) => {
  switch (menu.theme.templateId) {
    case 'school-fun':
      return <SchoolFunTemplate menu={menu} onEditCell={onEditCell} />;
    case 'minimal-modern':
      return <MinimalTemplate menu={menu} onEditCell={onEditCell} />;
    case 'healthy-vibrant':
      return <HealthyTemplate menu={menu} onEditCell={onEditCell} />;
    case 'boutique-bistro':
      return <BoutiqueTemplate menu={menu} onEditCell={onEditCell} />;
    case 'pastel-rainbow':
      return <PastelTemplate menu={menu} onEditCell={onEditCell} />;
    case 'grid-executive':
      return <GridExecutiveTemplate menu={menu} onEditCell={onEditCell} />;
    default:
      return <SchoolFunTemplate menu={menu} onEditCell={onEditCell} />;
  }
};
