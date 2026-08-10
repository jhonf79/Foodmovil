import { WeeklyMenu, PresetSampleMenu, LogoPreset } from '../types';
import erikaLogoImg from '../assets/images/logo-izquierda.png';
import castilloLogoImg from '../assets/images/logo-derecha.png';

export const LOGO_PRESETS: LogoPreset[] = [
  {
    id: 'chef-erika',
    name: 'Erika Empanadas / Chef',
    iconName: 'UtensilsCrossed',
    imageUrl: erikaLogoImg,
    bgClass: 'bg-amber-100 border-amber-300',
    textColorClass: 'text-amber-700',
  },
  {
    id: 'castle-school',
    name: 'Castillo Encantado / Colegio',
    iconName: 'Castle',
    imageUrl: castilloLogoImg,
    bgClass: 'bg-indigo-100 border-indigo-150',
    textColorClass: 'text-indigo-700',
  },
  {
    id: 'apple-mascot',
    name: 'Manzanita Escolar',
    iconName: 'Apple',
    bgClass: 'bg-emerald-100 border-emerald-300',
    textColorClass: 'text-emerald-700',
  },
  {
    id: 'nutrition-shield',
    name: 'Escudo Nutricional',
    iconName: 'ShieldCheck',
    bgClass: 'bg-teal-100 border-teal-300',
    textColorClass: 'text-teal-700',
  },
  {
    id: 'catering-crown',
    name: 'Catering Real',
    iconName: 'Crown',
    bgClass: 'bg-amber-100 border-yellow-400',
    textColorClass: 'text-amber-800',
  },
  {
    id: 'baby-sun',
    name: 'Sol Guardería',
    iconName: 'Sun',
    bgClass: 'bg-yellow-100 border-orange-300',
    textColorClass: 'text-orange-600',
  },
];

export const FOOD_TAGS = [
  { id: 'apple', name: 'Manzana / Fruta', emoji: '🍎', color: 'bg-red-50 text-red-600 border-red-200' },
  { id: 'juice', name: 'Jugo / Bebida', emoji: '🥤', color: 'bg-orange-50 text-orange-600 border-orange-200' },
  { id: 'protein', name: 'Pollo / Carne', emoji: '🍗', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'soup', name: 'Sopa / Crema', emoji: '🍲', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { id: 'salad', name: 'Ensalada / Verduras', emoji: '🥗', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'bread', name: 'Pan / Flauta', emoji: '🥖', color: 'bg-stone-50 text-stone-700 border-stone-200' },
  { id: 'healthy', name: 'Aguacate / Saludable', emoji: '🥑', color: 'bg-green-50 text-green-700 border-green-200' },
  { id: 'dairy', name: 'Lácteo / Leche', emoji: '🥛', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { id: 'dessert', name: 'Postre / Snack', emoji: '🍪', color: 'bg-pink-50 text-pink-600 border-pink-200' },
  { id: 'empanada', name: 'Empanada / Snack', emoji: '🥟', color: 'bg-amber-50 text-amber-800 border-amber-300' },
];

export const DEFAULT_WEEKLY_MENU: WeeklyMenu = {
  id: 'menu-castillo-encantado',
  name: 'Menú Escolar Castillo Encantado',
  updatedAt: new Date().toISOString(),
  header: {
    institutionName: 'COLEGIO PEDAGÓGICO CASTILLO ENCANTADO',
    subtitle: 'MENÚ SEMANAL',
    weekRangeText: 'SEMANA: DEL 10 AL 14 DE AGOSTO - 2026',
    startDate: '2026-08-10',
    leftLogoUrl: 'chef-erika',
    leftLogoType: 'preset',
    rightLogoUrl: 'castle-school',
    rightLogoType: 'preset',
    badgeText: 'Nivel Preescolar y Primaria',
  },
  footer: {
    slogan: '¡Comamos rico y saludable para crecer fuertes!',
    whatsappContact: '315 249 8876',
    emailOrWeb: 'www.colcastilloencantado.com',
    nutritionalNote: 'Nota: Todos los platos incluyen jugo natural sin azúcar añadida y agua fresca potable.',
    showAllergenKey: true,
  },
  columns: [
    { id: 'col-merienda-m', title: 'MERIENDA / MAÑANA', badgeBg: 'bg-cyan-500' },
    { id: 'col-almuerzo', title: 'ALMUERZO', badgeBg: 'bg-sky-500' },
    { id: 'col-merienda-t', title: 'MERIENDA / TARDE', badgeBg: 'bg-cyan-600' },
  ],
  days: [
    {
      dayId: 'lunes',
      dayName: 'Lunes',
      dateLabel: '10 Ago',
      meals: {
        'col-merienda-m': {
          items: ['Jugo natural de guayaba', 'Porción de fruta fresca'],
          iconTag: 'juice',
        },
        'col-almuerzo': {
          items: ['Arroz blanco frito', 'Jugo de mango', 'Pollo a la plancha', 'Ensalada de verduras'],
          iconTag: 'protein',
          calories: '420 kcal',
        },
        'col-merienda-t': {
          items: ['Empanada horneada', 'Jugo de naranja'],
          iconTag: 'empanada',
        },
      },
    },
    {
      dayId: 'martes',
      dayName: 'Martes',
      dateLabel: '11 Ago',
      meals: {
        'col-merienda-m': {
          items: ['Flauta tostada', 'Fruta picada', 'Jugo de lulo'],
          iconTag: 'bread',
        },
        'col-almuerzo': {
          items: ['Arroz primavera', 'Jugo natural', 'Pechuga apanada', 'Ensalada dulce de zanahoria'],
          iconTag: 'protein',
          calories: '450 kcal',
        },
        'col-merienda-t': {
          items: ['Panecillo con queso', 'Malteada de fresa'],
          iconTag: 'dairy',
        },
      },
    },
    {
      dayId: 'miercoles',
      dayName: 'Miércoles',
      dateLabel: '12 Ago',
      meals: {
        'col-merienda-m': {
          items: ['Avena helada', 'Galleta integral', 'Guineo en rodajas'],
          iconTag: 'healthy',
        },
        'col-almuerzo': {
          items: ['Arroz con fideos', 'Jugo de maracuyá', 'Carne desmechada', 'Sopa de verduras'],
          iconTag: 'soup',
          calories: '480 kcal',
        },
        'col-merienda-t': {
          items: ['Muffin casero de zanahoria', 'Jugo de manzana'],
          iconTag: 'dessert',
        },
      },
    },
    {
      dayId: 'jueves',
      dayName: 'Jueves',
      dateLabel: '13 Ago',
      meals: {
        'col-merienda-m': {
          items: ['Yogur natural', 'Cereal crocante', 'Uvas sin semilla'],
          iconTag: 'dairy',
        },
        'col-almuerzo': {
          items: ['Puré de papa criolla', 'Jugo de piña', 'Filete de pescado o pollo', 'Verduras al vapor'],
          iconTag: 'healthy',
          calories: '410 kcal',
        },
        'col-merienda-t': {
          items: ['Arepa con queso', 'Limonada de panela'],
          iconTag: 'bread',
        },
      },
    },
    {
      dayId: 'viernes',
      dayName: 'Viernes',
      dateLabel: '14 Ago',
      meals: {
        'col-merienda-m': {
          items: ['Panqueque de avena', 'Miel suave', 'Jugo de mora'],
          iconTag: 'dessert',
        },
        'col-almuerzo': {
          items: ['Arroz campestre', 'Crema de auyama', 'Pollo horneado', 'Ensalada mixta crunchy'],
          iconTag: 'protein',
          calories: '460 kcal',
        },
        'col-merienda-t': {
          items: ['Sandwich de jamón y queso', 'Jugo refrescante'],
          iconTag: 'bread',
        },
      },
    },
  ],
  theme: {
    templateId: 'school-fun',
    palette: 'warm-amber',
    fontStyle: 'rounded',
    showFoodIcons: true,
    showStickers: true,
    cardRadius: 'md',
    tableDensity: 'normal',
    accentColorHex: '#0284c7',
  },
};

export const PRESET_SAMPLE_MENUS: PresetSampleMenu[] = [
  {
    id: 'preset-castillo',
    name: 'Colegio Pedagógico Castillo Encantado',
    description: 'Menú tradicional escolar con meriendas y almuerzo apetitoso para niños.',
    category: 'Escolar',
    templateId: 'school-fun',
    data: DEFAULT_WEEKLY_MENU,
  },
  {
    id: 'preset-minimal-academy',
    name: 'Academia & Liceo Moderno',
    description: 'Diseño limpio y contemporáneo para instituciones secundarias o universitarias.',
    category: 'Escolar',
    templateId: 'minimal-modern',
    data: {
      ...DEFAULT_WEEKLY_MENU,
      id: 'preset-minimal-academy',
      name: 'Liceo Internacional - Menú Ejecutivo',
      header: {
        ...DEFAULT_WEEKLY_MENU.header,
        institutionName: 'Colegio Pedagógico Castillo Encantado',
        subtitle: 'PROGRAMA NUTRICIONAL SEMANAL',
        leftLogoUrl: 'nutrition-shield',
        rightLogoUrl: 'catering-crown',
      },
      theme: {
        templateId: 'minimal-modern',
        palette: 'classic-navy',
        fontStyle: 'sans',
        showFoodIcons: true,
        showStickers: false,
        cardRadius: 'sm',
        tableDensity: 'compact',
      },
    },
  },
  {
    id: 'preset-health-vitality',
    name: 'Menú Verde Vitalidad & Nutrición',
    description: 'Enfocado en nutrición consciente, calorías, opciones saludables y alérgenos.',
    category: 'Nutricional',
    templateId: 'healthy-vibrant',
    data: {
      ...DEFAULT_WEEKLY_MENU,
      id: 'preset-health-vitality',
      name: 'Menú Balance Nutritivo & Fitness',
      header: {
        ...DEFAULT_WEEKLY_MENU.header,
        institutionName: 'CENTRO NUTRICIONAL VITALITY',
        subtitle: 'MENÚ BALANCEADO & SALUDABLE',
        weekRangeText: 'SEMANA DEL 10 AL 14 DE AGOSTO',
        leftLogoUrl: 'apple-mascot',
        rightLogoUrl: 'nutrition-shield',
      },
      footer: {
        slogan: 'Nutrición real para un rendimiento óptimo diario.',
        whatsappContact: '310 889 7766',
        emailOrWeb: 'www.colcastilloencantado.com',
        nutritionalNote: 'Acompañado de infusión digestiva o agua alcalina.',
        showAllergenKey: true,
      },
      theme: {
        templateId: 'healthy-vibrant',
        palette: 'fresh-emerald',
        fontStyle: 'sans',
        showFoodIcons: true,
        showStickers: false,
        cardRadius: 'md',
        tableDensity: 'normal',
      },
    },
  },
  {
    id: 'preset-kinder-rainbow',
    name: 'Jardín Infantil Arcoíris Pastel',
    description: 'Bloques de colores suaves y divertidos, perfecto para guarderías y nidos.',
    category: 'Guardería',
    templateId: 'pastel-rainbow',
    data: {
      ...DEFAULT_WEEKLY_MENU,
      id: 'preset-kinder-rainbow',
      name: 'Jardín Infantil Mis Primeros Pasos',
      header: {
        ...DEFAULT_WEEKLY_MENU.header,
        institutionName: 'JARDÍN INFANTIL MIS PRIMEROS PASOS',
        subtitle: 'MENÚ SALUDABLE DE LOS PEQUES',
        leftLogoUrl: 'baby-sun',
        rightLogoUrl: 'apple-mascot',
      },
      theme: {
        templateId: 'pastel-rainbow',
        palette: 'playful-pink',
        fontStyle: 'rounded',
        showFoodIcons: true,
        showStickers: true,
        cardRadius: 'lg',
        tableDensity: 'spacious',
      },
    },
  },
  {
    id: 'preset-boutique-catering',
    name: 'Catering Gourmet & Eventos Bistro',
    description: 'Diseño elegante y refinado con tipografía gourmet para servicios de catering.',
    category: 'Catering',
    templateId: 'boutique-bistro',
    data: {
      ...DEFAULT_WEEKLY_MENU,
      id: 'preset-boutique-catering',
      name: 'Menú Gastronómico Bistro',
      header: {
        ...DEFAULT_WEEKLY_MENU.header,
        institutionName: 'ERIKA GASTRONOMÍA & CATERING',
        subtitle: 'CARTA Y MENÚ SEMANAL BISTRO',
        leftLogoUrl: 'chef-erika',
        rightLogoUrl: 'chef-erika',
      },
      theme: {
        templateId: 'boutique-bistro',
        palette: 'terracotta-gold',
        fontStyle: 'serif',
        showFoodIcons: false,
        showStickers: false,
        cardRadius: 'sm',
        tableDensity: 'normal',
      },
    },
  },
];
