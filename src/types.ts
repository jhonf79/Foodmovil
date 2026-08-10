export type TemplateId =
  | 'school-fun'
  | 'minimal-modern'
  | 'healthy-vibrant'
  | 'boutique-bistro'
  | 'pastel-rainbow'
  | 'grid-executive';

export type PaletteOption =
  | 'warm-amber'
  | 'fresh-emerald'
  | 'playful-pink'
  | 'ocean-blue'
  | 'classic-navy'
  | 'terracotta-gold';

export type FontOption = 'rounded' | 'sans' | 'serif' | 'display';

export interface MealColumn {
  id: string;
  title: string;
  subtitle?: string;
  badgeBg?: string;
}

export interface MealCell {
  items: string[];
  iconTag?: string;
  calories?: string;
  allergens?: string[];
  note?: string;
}

export interface DaySchedule {
  dayId: string;
  dayName: string;
  dateLabel?: string;
  meals: Record<string, MealCell>; // key is column id
}

export interface HeaderConfig {
  institutionName: string;
  subtitle: string;
  weekRangeText: string;
  startDate: string; // YYYY-MM-DD
  leftLogoUrl: string;
  leftLogoType: 'preset' | 'custom';
  rightLogoUrl: string;
  rightLogoType: 'preset' | 'custom';
  badgeText?: string;
}

export interface FooterConfig {
  slogan: string;
  whatsappContact: string;
  emailOrWeb?: string;
  nutritionalNote?: string;
  showAllergenKey?: boolean;
}

export interface ThemeConfig {
  templateId: TemplateId;
  palette: PaletteOption;
  fontStyle: FontOption;
  showFoodIcons: boolean;
  showStickers: boolean;
  cardRadius: 'sm' | 'md' | 'lg';
  tableDensity: 'compact' | 'normal' | 'spacious';
  accentColorHex?: string;
}

export interface WeeklyMenu {
  id: string;
  name: string;
  updatedAt: string;
  header: HeaderConfig;
  footer: FooterConfig;
  columns: MealColumn[];
  days: DaySchedule[];
  theme: ThemeConfig;
}

export interface LogoPreset {
  id: string;
  name: string;
  iconName: string;
  svgDataUri?: string;
  imageUrl?: string;
  bgClass: string;
  textColorClass: string;
}

export interface PresetSampleMenu {
  id: string;
  name: string;
  description: string;
  category: 'Escolar' | 'Nutricional' | 'Guardería' | 'Catering';
  templateId: TemplateId;
  data: WeeklyMenu;
}
