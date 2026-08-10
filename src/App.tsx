import React, { useState, useEffect } from 'react';
import { WeeklyMenu, TemplateId, MealCell } from './types';
import { DEFAULT_WEEKLY_MENU, PRESET_SAMPLE_MENUS } from './data/defaultData';
import { Navbar } from './components/Navbar';
import { EditorSidebar } from './components/EditorSidebar';
import { TemplateRenderer } from './components/TemplateRenderer';
import { AiMenuModal } from './components/AiMenuModal';
import { Sparkles, RefreshCw, ZoomIn, ZoomOut, Maximize2, Layers } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'foodclass_saved_menu_v2';

export default function App() {
  const [menu, setMenu] = useState<WeeklyMenu>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved menu:', e);
      }
    }
    return DEFAULT_WEEKLY_MENU;
  });

  const [selectedCell, setSelectedCell] = useState<{ dayId: string; colId: string } | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Auto-calculate zoom level on mobile so the menu fits automatically on small screens
  useEffect(() => {
    const autoScaleForScreen = () => {
      if (window.innerWidth < 960) {
        const availableWidth = window.innerWidth - 32;
        const fitZoom = Math.min(100, Math.max(35, Math.floor((availableWidth / 880) * 100)));
        setZoomLevel(fitZoom);
      } else {
        setZoomLevel(100);
      }
    };

    autoScaleForScreen();
    window.addEventListener('resize', autoScaleForScreen);
    return () => window.removeEventListener('resize', autoScaleForScreen);
  }, []);

  // Auto-save to LocalStorage
  const handleSaveLocal = () => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(menu));
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  };

  // Reset menu to default
  const handleResetMenu = () => {
    if (window.confirm('¿Deseas restablecer el menú al modelo original?')) {
      setMenu(DEFAULT_WEEKLY_MENU);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  // Load a pre-configured sample preset
  const handleLoadPreset = (presetId: string) => {
    const found = PRESET_SAMPLE_MENUS.find((p) => p.id === presetId);
    if (found) {
      setMenu(found.data);
    }
  };

  // Handle template change
  const handleChangeTemplate = (templateId: TemplateId) => {
    setMenu((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        templateId,
      },
    }));
  };

  // Apply AI Generated menu contents
  const handleApplyGeneratedMenu = (generatedGrid: any[], newTitle?: string, newSlogan?: string) => {
    if (!generatedGrid || !Array.isArray(generatedGrid)) return;

    // Create a copy of current days
    const updatedDays = menu.days.map((day) => {
      // Find matching day in AI output
      const aiDay = generatedGrid.find(
        (g) => g.day && g.day.toLowerCase().includes(day.dayName.toLowerCase())
      );

      if (!aiDay || !aiDay.meals) return day;

      const newMeals: Record<string, MealCell> = { ...day.meals };

      menu.columns.forEach((col) => {
        const aiMeal = aiDay.meals.find(
          (m: any) =>
            m.mealName &&
            (m.mealName.toLowerCase().includes(col.title.toLowerCase()) ||
              col.title.toLowerCase().includes(m.mealName.toLowerCase()))
        );

        if (aiMeal && aiMeal.content) {
          const itemsArr = aiMeal.content
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean);

          newMeals[col.id] = {
            items: itemsArr,
            iconTag: aiMeal.iconTag || 'healthy',
          };
        }
      });

      return {
        ...day,
        meals: newMeals,
      };
    });

    setMenu((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        institutionName: newTitle || prev.header.institutionName,
      },
      footer: {
        ...prev.footer,
        slogan: newSlogan || prev.footer.slogan,
      },
      days: updatedDays,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Navbar Header */}
      <Navbar
        currentMenu={menu}
        onChangeTemplate={handleChangeTemplate}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onResetMenu={handleResetMenu}
        onSaveLocal={handleSaveLocal}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar Controls */}
        <EditorSidebar
          menu={menu}
          onChangeMenu={setMenu}
          selectedCell={selectedCell}
          onClearSelectedCell={() => setSelectedCell(null)}
          onOpenAiModal={() => setIsAiModalOpen(true)}
          onLoadPreset={handleLoadPreset}
        />

        {/* Right / Main Live Preview Area */}
        <main className="flex-1 p-2 sm:p-6 md:p-8 overflow-y-auto flex flex-col items-center bg-slate-200/80">
          {/* Live Preview Control Toolbar */}
          <div className="w-full max-w-4xl mb-3 sm:mb-4 flex flex-wrap items-center justify-between gap-2 bg-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-slate-200 shadow-sm no-print">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shrink-0" />
              <span>Vista Previa</span>
              <span className="text-slate-400 font-normal hidden sm:inline">| Haz clic en cualquier celda para editar</span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Auto Fit toggle button */}
              <button
                onClick={() => {
                  const availableWidth = window.innerWidth - 32;
                  const fitZoom = Math.min(100, Math.max(35, Math.floor((availableWidth / 880) * 100)));
                  setZoomLevel((z) => (z === 100 ? fitZoom : 100));
                }}
                className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 shrink-0"
                title="Ajustar a pantalla o ver al 100%"
              >
                <Maximize2 size={12} />
                <span>{zoomLevel === 100 ? 'Ajustar' : '100%'}</span>
              </button>

              {/* Zoom controls */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-700 shrink-0">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(35, z - 10))}
                  className="p-1 hover:bg-white rounded transition-colors"
                  title="Reducir Zoom"
                >
                  <ZoomOut size={14} />
                </button>
                <span className="w-8 sm:w-10 text-center text-[11px]">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                  className="p-1 hover:bg-white rounded transition-colors"
                  title="Aumentar Zoom"
                >
                  <ZoomIn size={14} />
                </button>
              </div>

              {/* Reset to Default */}
              <button
                onClick={handleResetMenu}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors shrink-0"
                title="Restablecer plantilla inicial"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Interactive Printable Menu Container */}
          <div className="w-full overflow-x-auto pb-8 pt-1 px-1 flex flex-col items-center justify-start transition-all duration-200 printable-wrapper scrollbar-thin">
            <div
              className="transition-transform duration-200 origin-top flex flex-col items-center justify-start shrink-0"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                width: '880px',
                marginBottom: zoomLevel < 100 ? `${(zoomLevel - 100) * 0.52}%` : '0px',
              }}
            >
              <TemplateRenderer
                menu={menu}
                onEditCell={(dayId, colId) => setSelectedCell({ dayId, colId })}
              />
            </div>
          </div>
        </main>
      </div>

      {/* AI Assistant Generator Modal */}
      <AiMenuModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        currentMenu={menu}
        onApplyGeneratedMenu={handleApplyGeneratedMenu}
      />
    </div>
  );
}
