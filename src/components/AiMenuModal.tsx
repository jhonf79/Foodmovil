import React, { useState } from 'react';
import { Sparkles, Wand2, Loader2, X, Check, Utensils } from 'lucide-react';
import { WeeklyMenu } from '../types';

interface AiMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMenu: WeeklyMenu;
  onApplyGeneratedMenu: (generatedGrid: any, title?: string, slogan?: string) => void;
}

export const AiMenuModal: React.FC<AiMenuModalProps> = ({
  isOpen,
  onClose,
  currentMenu,
  onApplyGeneratedMenu,
}) => {
  const [targetType, setTargetType] = useState('Colegio / Escuela Infantil');
  const [dietType, setDietType] = useState('Equilibrado y Nutritivo');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    const daysList = currentMenu.days.map((d) => d.dayName);
    const mealsList = currentMenu.columns.map((c) => c.title);

    try {
      const res = await fetch('/api/gemini/generate-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType,
          dietType,
          customPrompt,
          days: daysList,
          meals: mealsList,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al conectar con la Inteligencia Artificial.');
      }

      if (data.menuGrid) {
        onApplyGeneratedMenu(data.menuGrid, data.title, data.slogan);
        onClose();
      } else {
        throw new Error('Respuesta incompleta de IA.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Ocurrió un problema generando el menú con IA.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Sparkles size={22} className="text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-wide leading-tight">
                Generador de Menús con IA Gemini
              </h3>
              <p className="text-xs text-purple-100">
                Crea menús nutricionales apetitosos y balanceados en segundos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 text-sm">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Target Audience */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              1. Tipo de Institución / Audiencia
            </label>
            <select
              value={targetType}
              onChange={(e) => setTargetType(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Colegio / Escuela Infantil">Colegio / Preescolar / Primaria</option>
              <option value="Guardería / Nido de Bebés">Guardería / Nido (Niños de 1 a 4 años)</option>
              <option value="Liceo / Secundaria">Liceo / Secundaria / Universidad</option>
              <option value="Centro Nutricional Fitness">Centro Nutricional & Fitness</option>
              <option value="Catering & Bistro Gourmet">Catering Gourmet / Eventos</option>
            </select>
          </div>

          {/* Diet style */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              2. Estilo de Dieta o Enfoque Nutricional
            </label>
            <select
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Equilibrado y Nutritivo">Equilibrado y Nutritivo Tradicional</option>
              <option value="Apetitoso Infantil Escolar">Apetitoso e Infantil (Juegos, frutas y proteínas)</option>
              <option value="Vegetariano & Saludable">Vegetariano / Plant-Based</option>
              <option value="Bajo en Azúcar & Orgánico">Bajo en Azúcar & 100% Saludable</option>
              <option value="Alto en Proteínas & Fitness">Alto en Proteínas (Deportes / Energía)</option>
            </select>
          </div>

          {/* Custom Instruction Prompt */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              3. Indicaciones o Preferencias Especiales (Opcional)
            </label>
            <textarea
              rows={3}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ej: Incluir empanadas los viernes, arroz con pollo el lunes, jugo natural sin azúcar y sopas reconfortantes..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl text-xs text-purple-900 flex items-start gap-2">
            <Utensils size={18} className="text-purple-600 flex-shrink-0 mt-0.5" />
            <span>
              La IA generará propuestas de platos para los <strong>{currentMenu.days.length} días</strong> y{' '}
              <strong>{currentMenu.columns.length} horarios</strong> actualmente configurados en tu menú.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md inline-flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Generando Menú IA...</span>
              </>
            ) : (
              <>
                <Wand2 size={16} />
                <span>Generar Menú Completo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
