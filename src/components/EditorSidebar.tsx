import React, { useState } from 'react';
import {
  Palette,
  Building2,
  CalendarDays,
  UtensilsCrossed,
  MessageSquare,
  Plus,
  Trash2,
  Upload,
  Sparkles,
  Check,
  ChevronRight,
  Layers,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { WeeklyMenu, TemplateId, MealColumn, DaySchedule } from '../types';
import { LOGO_PRESETS, FOOD_TAGS, PRESET_SAMPLE_MENUS } from '../data/defaultData';
import { LogoRenderer } from './LogoRenderer';

interface EditorSidebarProps {
  menu: WeeklyMenu;
  onChangeMenu: (updated: WeeklyMenu) => void;
  selectedCell: { dayId: string; colId: string } | null;
  onClearSelectedCell: () => void;
  onOpenAiModal: () => void;
  onLoadPreset: (presetId: string) => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  menu,
  onChangeMenu,
  selectedCell,
  onClearSelectedCell,
  onOpenAiModal,
  onLoadPreset,
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'header' | 'structure' | 'content' | 'footer'>('templates');

  // Helpers to update menu nested properties
  const updateHeader = (fields: Partial<typeof menu.header>) => {
    onChangeMenu({
      ...menu,
      header: { ...menu.header, ...fields },
    });
  };

  const updateFooter = (fields: Partial<typeof menu.footer>) => {
    onChangeMenu({
      ...menu,
      footer: { ...menu.footer, ...fields },
    });
  };

  const updateTheme = (fields: Partial<typeof menu.theme>) => {
    onChangeMenu({
      ...menu,
      theme: { ...menu.theme, ...fields },
    });
  };

  // Date range calculator
  const handleDateChange = (newDate: string) => {
    if (!newDate) return;
    const start = new Date(newDate + 'T00:00:00');
    if (isNaN(start.getTime())) return;

    const end = new Date(start);
    end.setDate(start.getDate() + 4);

    const formatSpanishDate = (d: Date) => {
      const day = d.getDate();
      const month = d.toLocaleString('es-ES', { month: 'long' }).toUpperCase();
      const year = d.getFullYear();
      return { day, month, year };
    };

    const startInfo = formatSpanishDate(start);
    const endInfo = formatSpanishDate(end);

    let rangeStr = '';
    if (startInfo.month === endInfo.month) {
      rangeStr = `SEMANA: DEL ${startInfo.day} AL ${endInfo.day} DE ${startInfo.month} - ${startInfo.year}`;
    } else {
      rangeStr = `SEMANA: DEL ${startInfo.day} DE ${startInfo.month} AL ${endInfo.day} DE ${endInfo.month} - ${startInfo.year}`;
    }

    // Auto update days labels as well
    const updatedDays = menu.days.map((day, idx) => {
      const currentDayDate = new Date(start);
      currentDayDate.setDate(start.getDate() + idx);
      const dayNum = currentDayDate.getDate();
      const monthShort = currentDayDate.toLocaleString('es-ES', { month: 'short' });
      return {
        ...day,
        dateLabel: `${dayNum} ${monthShort.charAt(0).toUpperCase() + monthShort.slice(1)}`,
      };
    });

    onChangeMenu({
      ...menu,
      header: {
        ...menu.header,
        startDate: newDate,
        weekRangeText: rangeStr,
      },
      days: updatedDays,
    });
  };

  // Upload custom logo image file
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'left' | 'right') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      if (side === 'left') {
        updateHeader({ leftLogoUrl: dataUri, leftLogoType: 'custom' });
      } else {
        updateHeader({ rightLogoUrl: dataUri, rightLogoType: 'custom' });
      }
    };
    reader.readAsDataURL(file);
  };

  // Add / Remove Column
  const handleAddColumn = () => {
    const newId = `col-${Date.now()}`;
    const newCol: MealColumn = {
      id: newId,
      title: 'NUEVA COMIDA',
      badgeBg: 'bg-indigo-500',
    };
    onChangeMenu({
      ...menu,
      columns: [...menu.columns, newCol],
    });
  };

  const handleRemoveColumn = (colId: string) => {
    if (menu.columns.length <= 1) return;
    onChangeMenu({
      ...menu,
      columns: menu.columns.filter((c) => c.id !== colId),
    });
  };

  // Toggle Days Count (5, 6 or 7 days)
  const handleSetDaysCount = (count: number) => {
    const fullWeekDays = [
      { id: 'lunes', name: 'Lunes' },
      { id: 'martes', name: 'Martes' },
      { id: 'miercoles', name: 'Miércoles' },
      { id: 'jueves', name: 'Jueves' },
      { id: 'viernes', name: 'Viernes' },
      { id: 'sabado', name: 'Sábado' },
      { id: 'domingo', name: 'Domingo' },
    ];

    const currentDaysMap = new Map<string, DaySchedule>(menu.days.map((d) => [d.dayId, d]));

    const newDays: DaySchedule[] = fullWeekDays.slice(0, count).map((d) => {
      if (currentDaysMap.has(d.id)) {
        return currentDaysMap.get(d.id)!;
      }
      return {
        dayId: d.id,
        dayName: d.name,
        meals: {},
      };
    });

    onChangeMenu({
      ...menu,
      days: newDays,
    });
  };

  // Edit cell text & icon
  const handleCellChange = (dayId: string, colId: string, itemsText: string, iconTag?: string) => {
    // Keep raw line splits so users can type Enter to create new lines
    const itemsArray = itemsText.split('\n');

    const updatedDays = menu.days.map((day) => {
      if (day.dayId !== dayId) return day;
      const currentCell = day.meals[colId] || { items: [] };
      return {
        ...day,
        meals: {
          ...day.meals,
          [colId]: {
            ...currentCell,
            items: itemsArray,
            iconTag: iconTag !== undefined ? iconTag : currentCell.iconTag,
          },
        },
      };
    });

    onChangeMenu({ ...menu, days: updatedDays });
  };

  return (
    <aside className="w-full lg:w-96 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col h-full overflow-hidden text-slate-800 text-xs no-print">
      {/* Tab Nav Buttons */}
      <div className="flex items-center border-b border-slate-200 bg-slate-50 p-1 gap-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 min-w-[70px] py-2 px-2.5 rounded-xl font-bold flex flex-col items-center gap-1 transition-all ${
            activeTab === 'templates'
              ? 'bg-white text-purple-700 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Palette size={16} />
          <span>Plantillas</span>
        </button>

        <button
          onClick={() => setActiveTab('header')}
          className={`flex-1 min-w-[70px] py-2 px-2.5 rounded-xl font-bold flex flex-col items-center gap-1 transition-all ${
            activeTab === 'header'
              ? 'bg-white text-purple-700 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 size={16} />
          <span>Encabezado</span>
        </button>

        <button
          onClick={() => setActiveTab('structure')}
          className={`flex-1 min-w-[70px] py-2 px-2.5 rounded-xl font-bold flex flex-col items-center gap-1 transition-all ${
            activeTab === 'structure'
              ? 'bg-white text-purple-700 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CalendarDays size={16} />
          <span>Días & Horas</span>
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 min-w-[70px] py-2 px-2.5 rounded-xl font-bold flex flex-col items-center gap-1 transition-all ${
            activeTab === 'content'
              ? 'bg-white text-purple-700 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UtensilsCrossed size={16} />
          <span>Platos</span>
        </button>

        <button
          onClick={() => setActiveTab('footer')}
          className={`flex-1 min-w-[70px] py-2 px-2.5 rounded-xl font-bold flex flex-col items-center gap-1 transition-all ${
            activeTab === 'footer'
              ? 'bg-white text-purple-700 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare size={16} />
          <span>Pie</span>
        </button>
      </div>

      {/* AI Button Banner */}
      <div className="p-3 bg-gradient-to-r from-purple-50 via-indigo-50 to-sky-50 border-b border-purple-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-600 text-white rounded-lg shadow-sm">
            <Sparkles size={16} />
          </div>
          <div>
            <span className="font-extrabold text-purple-900">¿Sin ideas para el menú?</span>
            <p className="text-[10px] text-purple-700">Genera propuestas automáticas con IA</p>
          </div>
        </div>
        <button
          onClick={onOpenAiModal}
          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-lg shadow text-xs inline-flex items-center gap-1 transition-all"
        >
          <span>IA Gemini</span>
        </button>
      </div>

      {/* TAB CONTENTS */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* TAB 1: PLANTILLAS */}
        {activeTab === 'templates' && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2">
                Seleccionar Plantilla de Diseño
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'school-fun', name: 'Escolar Divertido', desc: 'Ideal colegios e infantil', badge: 'Popular' },
                  { id: 'minimal-modern', name: 'Minimalista Elegante', desc: 'Liceos y academias', badge: 'Limpio' },
                  { id: 'healthy-vibrant', name: 'Nutricional & Salud', desc: 'Verde con calorías', badge: 'Fitness' },
                  { id: 'pastel-rainbow', name: 'Arcoíris Pasteles', desc: 'Guarderías y nidos', badge: 'Pastel' },
                  { id: 'boutique-bistro', name: 'Boutique Gourmet', desc: 'Catering & Bistro', badge: 'Elegante' },
                  { id: 'grid-executive', name: 'Grilla Ejecutiva', desc: 'Diseño para imprimir', badge: 'Directo' },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => updateTheme({ templateId: tpl.id as TemplateId })}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      menu.theme.templateId === tpl.id
                        ? 'bg-purple-50/80 border-purple-600 ring-2 ring-purple-500/20 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-slate-900 text-xs">{tpl.name}</span>
                        {menu.theme.templateId === tpl.id && (
                          <Check size={14} className="text-purple-600" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">{tpl.desc}</p>
                    </div>
                    <span className="mt-2 text-[9px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md w-fit">
                      {tpl.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Presets Sample Loader */}
            <div className="pt-2 border-t border-slate-200">
              <h4 className="font-bold text-slate-800 text-xs mb-2">Cargar Menús de Muestra Pre-Diseñados</h4>
              <div className="space-y-2">
                {PRESET_SAMPLE_MENUS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onLoadPreset(preset.id)}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-bold text-slate-800 text-xs block">{preset.name}</span>
                      <span className="text-[10px] text-slate-500">{preset.description}</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 group-hover:text-purple-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Display options */}
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-800 text-xs">Opciones Visuales</h4>
              <label className="flex items-center justify-between cursor-pointer p-2 bg-slate-50 rounded-xl">
                <span className="font-semibold text-slate-700">Mostrar Íconos de Comida (🍎, 🥤)</span>
                <input
                  type="checkbox"
                  checked={menu.theme.showFoodIcons}
                  onChange={(e) => updateTheme({ showFoodIcons: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-2 bg-slate-50 rounded-xl">
                <span className="font-semibold text-slate-700">Mostrar Stickers/Detalles Decorativos</span>
                <input
                  type="checkbox"
                  checked={menu.theme.showStickers}
                  onChange={(e) => updateTheme({ showStickers: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
              </label>
            </div>
          </div>
        )}

        {/* TAB 2: ENCABEZADO Y MARCA */}
        {activeTab === 'header' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nombre de la Institución / Empresa</label>
              <input
                type="text"
                value={menu.header.institutionName}
                onChange={(e) => updateHeader({ institutionName: e.target.value })}
                placeholder="Ej: COLEGIO PEDAGÓGICO CASTILLO ENCANTADO"
                className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Subtítulo del Encabezado</label>
              <input
                type="text"
                value={menu.header.subtitle}
                onChange={(e) => updateHeader({ subtitle: e.target.value })}
                placeholder="Ej: MENÚ SEMANAL DE ALMUERZOS"
                className="w-full p-2.5 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Date Range Calculator */}
            <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-100 space-y-2">
              <label className="block font-bold text-purple-900">Calculadora de Rango de Fecha</label>
              <p className="text-[10px] text-purple-700">Selecciona el Lunes de inicio y se actualizará el texto automáticamente:</p>
              <input
                type="date"
                value={menu.header.startDate || '2026-08-10'}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full p-2 bg-white border border-purple-300 rounded-lg font-mono font-bold text-slate-800"
              />
              <input
                type="text"
                value={menu.header.weekRangeText}
                onChange={(e) => updateHeader({ weekRangeText: e.target.value })}
                placeholder="Texto del rango de fecha..."
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold text-slate-800 text-xs"
              />
            </div>

            {/* Logos Picker */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <h4 className="font-bold text-slate-800 text-xs">Logotipos (Izquierdo y Derecho)</h4>

              {/* Left Logo */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Logo Izquierdo</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateHeader({ leftLogoType: 'preset' })}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        menu.header.leftLogoType === 'preset'
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      Vector Preset
                    </button>
                    <label className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 rounded text-[10px] font-bold cursor-pointer text-slate-700">
                      Subir Imagen
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleLogoUpload(e, 'left')}
                      />
                    </label>
                  </div>
                </div>

                {menu.header.leftLogoType === 'preset' ? (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {LOGO_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => updateHeader({ leftLogoUrl: preset.id })}
                        className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 ${
                          menu.header.leftLogoUrl === preset.id
                            ? 'bg-purple-100 border-purple-500'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <LogoRenderer logoUrl={preset.id} logoType="preset" className="w-8 h-8" iconSize={18} />
                        <span className="text-[9px] font-bold truncate max-w-full text-slate-700">{preset.name.split('/')[0]}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogoRenderer
                      logoUrl={menu.header.leftLogoUrl}
                      logoType="custom"
                      className="w-10 h-10"
                    />
                    <span className="text-xs font-semibold text-emerald-600">✓ Logo personal cargado</span>
                  </div>
                )}
              </div>

              {/* Right Logo */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Logo Derecho</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateHeader({ rightLogoType: 'preset' })}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        menu.header.rightLogoType === 'preset'
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      Vector Preset
                    </button>
                    <label className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 rounded text-[10px] font-bold cursor-pointer text-slate-700">
                      Subir Imagen
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleLogoUpload(e, 'right')}
                      />
                    </label>
                  </div>
                </div>

                {menu.header.rightLogoType === 'preset' ? (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {LOGO_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => updateHeader({ rightLogoUrl: preset.id })}
                        className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 ${
                          menu.header.rightLogoUrl === preset.id
                            ? 'bg-purple-100 border-purple-500'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <LogoRenderer logoUrl={preset.id} logoType="preset" className="w-8 h-8" iconSize={18} />
                        <span className="text-[9px] font-bold truncate max-w-full text-slate-700">{preset.name.split('/')[0]}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogoRenderer
                      logoUrl={menu.header.rightLogoUrl}
                      logoType="custom"
                      className="w-10 h-10"
                    />
                    <span className="text-xs font-semibold text-emerald-600">✓ Logo personal cargado</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ESTRUCTURA Y DÍAS */}
        {activeTab === 'structure' && (
          <div className="space-y-5 animate-fade-in">
            {/* Days count selector */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Días Incluidos en la Semana</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { count: 5, label: '5 Días (L - V)' },
                  { count: 6, label: '6 Días (L - S)' },
                  { count: 7, label: '7 Días (L - D)' },
                ].map((item) => (
                  <button
                    key={item.count}
                    onClick={() => handleSetDaysCount(item.count)}
                    className={`py-2 px-2 rounded-xl font-bold border text-xs text-center transition-all ${
                      menu.days.length === item.count
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Columns Manager */}
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800 text-xs">Columnas / Horarios de Comida</h4>
                <button
                  onClick={handleAddColumn}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs inline-flex items-center gap-1"
                >
                  <Plus size={14} />
                  <span>Agregar Horario</span>
                </button>
              </div>

              <div className="space-y-2">
                {menu.columns.map((col, idx) => (
                  <div key={col.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <span className="font-bold text-slate-400 text-xs w-4">{idx + 1}.</span>
                    <input
                      type="text"
                      value={col.title}
                      onChange={(e) => {
                        const newCols = menu.columns.map((c) =>
                          c.id === col.id ? { ...c, title: e.target.value } : c
                        );
                        onChangeMenu({ ...menu, columns: newCols });
                      }}
                      className="flex-1 p-2 bg-white border border-slate-300 rounded-lg font-extrabold uppercase text-xs text-slate-800"
                    />
                    <button
                      onClick={() => handleRemoveColumn(col.id)}
                      disabled={menu.columns.length <= 1}
                      className="p-2 text-slate-400 hover:text-red-600 disabled:opacity-30 transition-colors"
                      title="Eliminar columna"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PLATOS / CONTENIDO */}
        {activeTab === 'content' && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-slate-500 text-[11px]">
              Selecciona un día y una columna de comida para editar sus platos e íconos:
            </p>

            {menu.days.map((day) => (
              <div key={day.dayId} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="bg-slate-100 px-3 py-2 font-extrabold text-slate-800 border-b border-slate-200 flex items-center justify-between">
                  <span>{day.dayName}</span>
                  <span className="text-[10px] text-slate-500">{day.dateLabel}</span>
                </div>

                <div className="p-3 space-y-3">
                  {menu.columns.map((col) => {
                    const meal = day.meals[col.id] || { items: [] };
                    const isSelected =
                      selectedCell?.dayId === day.dayId && selectedCell?.colId === col.id;

                    return (
                      <div
                        key={col.id}
                        className={`p-2.5 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-400/20'
                            : 'bg-slate-50/70 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-[11px] text-purple-900 uppercase">
                            {col.title}
                          </span>
                          <span className="text-[10px] text-slate-400">Pone 1 plato por línea</span>
                        </div>

                        {/* Textarea for dishes */}
                        <textarea
                          rows={2}
                          value={(meal.items || []).join('\n')}
                          onChange={(e) =>
                            handleCellChange(day.dayId, col.id, e.target.value)
                          }
                          placeholder="Escribe cada plato en una línea..."
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />

                        {/* Tag/Icon selector */}
                        <div className="mt-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
                          <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">Ícono:</span>
                          {FOOD_TAGS.map((tag) => (
                            <button
                              key={tag.id}
                              onClick={() => handleCellChange(day.dayId, col.id, (meal.items || []).join('\n'), tag.id)}
                              className={`p-1 rounded text-xs transition-transform hover:scale-110 ${
                                meal.iconTag === tag.id
                                  ? 'bg-purple-200 border border-purple-500'
                                  : 'bg-white border border-slate-200'
                              }`}
                              title={tag.name}
                            >
                              {tag.emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: PIE DE PÁGINA */}
        {activeTab === 'footer' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Eslogan o Mensaje Inspirador</label>
              <input
                type="text"
                value={menu.footer.slogan}
                onChange={(e) => updateFooter({ slogan: e.target.value })}
                placeholder="Ej: ¡Comamos rico y saludable para crecer fuertes!"
                className="w-full p-2.5 border border-slate-300 rounded-xl font-extrabold text-slate-900 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Teléfono WhatsApp de Contacto</label>
              <input
                type="text"
                value={menu.footer.whatsappContact}
                onChange={(e) => updateFooter({ whatsappContact: e.target.value })}
                placeholder="Ej: 315 249 8876"
                className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Correo o Sitio Web</label>
              <input
                type="text"
                value={menu.footer.emailOrWeb || ''}
                onChange={(e) => updateFooter({ emailOrWeb: e.target.value })}
                placeholder="Ej: www.colcastilloencantado.com"
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nota Nutricional o de Alérgenos</label>
              <textarea
                rows={3}
                value={menu.footer.nutritionalNote || ''}
                onChange={(e) => updateFooter({ nutritionalNote: e.target.value })}
                placeholder="Ej: Todos los platos son elaborados con ingredientes frescos y agua potable..."
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
