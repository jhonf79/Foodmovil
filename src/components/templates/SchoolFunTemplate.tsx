import React from 'react';
import { WeeklyMenu } from '../../types';
import { LogoRenderer } from '../LogoRenderer';
import { FOOD_TAGS } from '../../data/defaultData';
import { Phone, MessageSquare, Sparkles } from 'lucide-react';

interface TemplateProps {
  menu: WeeklyMenu;
  onEditCell?: (dayId: string, colId: string) => void;
}

export const SchoolFunTemplate: React.FC<TemplateProps> = ({ menu, onEditCell }) => {
  const { header, footer, columns, days, theme } = menu;

  const getTagEmoji = (tagId?: string) => {
    if (!tagId) return '🍎';
    const tag = FOOD_TAGS.find((t) => t.id === tagId);
    return tag ? tag.emoji : '🍎';
  };

  return (
    <div
      id="menu-printable-area"
      className="w-full max-w-4xl min-w-[880px] mx-auto bg-amber-50/40 p-6 sm:p-8 rounded-3xl border-4 border-amber-200/80 shadow-xl transition-all relative overflow-hidden font-sans select-none"
    >
      {/* Decorative top wave/badge */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-200/50 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-sky-200/50 rounded-full blur-2xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="relative z-10 flex flex-col items-center text-center pb-6 border-b-4 border-red-500 mb-6">
        <div className="w-full flex items-center justify-between gap-4 mb-3">
          {/* Left Logo */}
          <div className="flex-shrink-0">
            <LogoRenderer
              logoUrl={header.leftLogoUrl}
              logoType={header.leftLogoType}
              altText="Logo Izquierdo"
              className="w-20 h-20 sm:w-24 sm:h-24"
              iconSize={42}
            />
          </div>

          {/* Titles */}
          <div className="flex-1 px-2">
            {header.badgeText && (
              <span className="inline-block px-3 py-1 mb-1 text-xs font-bold uppercase tracking-wider bg-amber-200 text-amber-900 rounded-full">
                {header.badgeText}
              </span>
            )}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-900 tracking-wide leading-tight uppercase font-display">
              {header.institutionName || 'NOMBRE DE LA INSTITUCIÓN'}
            </h1>
            <h2 className="text-lg sm:text-xl font-black text-purple-700 tracking-wider uppercase mt-1">
              {header.subtitle || 'MENÚ SEMANAL'}
            </h2>
            <div className="mt-2 inline-block bg-white/90 border-2 border-amber-300 px-4 py-1 rounded-full shadow-sm text-xs sm:text-sm font-bold text-slate-800 tracking-wide">
              {header.weekRangeText || 'SEMANA DEL 10 AL 14 DE AGOSTO - 2026'}
            </div>
          </div>

          {/* Right Logo */}
          <div className="flex-shrink-0">
            <LogoRenderer
              logoUrl={header.rightLogoUrl}
              logoType={header.rightLogoType}
              altText="Logo Derecho"
              className="w-20 h-20 sm:w-24 sm:h-24"
              iconSize={42}
            />
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="overflow-x-auto rounded-2xl border-2 border-sky-300 bg-white shadow-md mb-6">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-500 text-white font-extrabold uppercase text-xs sm:text-sm tracking-wider">
              <th className="py-3.5 px-4 border-r border-sky-300 text-center w-28 sm:w-32 bg-cyan-500">
                DÍA
              </th>
              {columns.map((col) => (
                <th
                  key={col.id}
                  className="py-3.5 px-4 border-r last:border-r-0 border-sky-300 text-center tracking-wider"
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-200/70 text-slate-800 text-xs sm:text-sm">
            {days.map((day, rowIndex) => {
              const isEven = rowIndex % 2 === 0;
              return (
                <tr
                  key={day.dayId}
                  className={`${
                    isEven ? 'bg-amber-50/30' : 'bg-pink-50/20'
                  } hover:bg-sky-50/50 transition-colors group`}
                >
                  {/* Day Column */}
                  <td className="py-4 px-3 border-r border-amber-200 text-center font-black text-amber-950 bg-amber-100/50 flex flex-col items-center justify-center min-h-[80px]">
                    <div className="flex items-center gap-1.5">
                      {theme.showStickers && (
                        <span className="text-sm">
                          {rowIndex % 2 === 0 ? '🌟' : '🍎'}
                        </span>
                      )}
                      <span className="text-sm sm:text-base">{day.dayName}</span>
                    </div>
                    {day.dateLabel && (
                      <span className="text-[10px] font-semibold text-amber-700/80 mt-0.5">
                        {day.dateLabel}
                      </span>
                    )}
                  </td>

                  {/* Meal Columns */}
                  {columns.map((col) => {
                    const meal = day.meals[col.id] || { items: [] };
                    const activeItems = (meal.items || []).filter((item) => item && item.trim().length > 0);
                    return (
                      <td
                        key={col.id}
                        onClick={() => onEditCell && onEditCell(day.dayId, col.id)}
                        className="py-3 px-4 border-r last:border-r-0 border-amber-200/80 align-top cursor-pointer hover:bg-white/80 transition-all group-hover:border-sky-200"
                        title="Haz clic para editar"
                      >
                        <div className="space-y-1.5 min-h-[60px] flex flex-col justify-center">
                          {activeItems.length > 0 ? (
                            activeItems.map((item, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 leading-tight"
                              >
                                {theme.showFoodIcons && (
                                  <span className="text-sm flex-shrink-0 mt-0.5 select-none">
                                    {getTagEmoji(meal.iconTag)}
                                  </span>
                                )}
                                <span className="font-bold text-slate-800 capitalize">
                                  {item}
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="text-slate-400 italic text-xs">
                              -- Sin menú asignado --
                            </span>
                          )}

                          {meal.calories && (
                            <span className="inline-block mt-1 text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full w-fit">
                              {meal.calories}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* FOOTER SECTION */}
      <div className="flex flex-col items-center justify-center text-center space-y-3 pt-2">
        {/* Juice glass illustration */}
        <div className="w-16 h-16 bg-orange-100 border-2 border-orange-300 rounded-2xl flex items-center justify-center shadow-sm text-3xl animate-bounce-slow">
          🍹
        </div>

        {/* Slogan */}
        <p className="text-base sm:text-lg font-black text-slate-800 italic tracking-wide">
          "{footer.slogan || '¡Comamos rico y saludable para crecer fuertes!'}"
        </p>

        {/* Contact info & WhatsApp */}
        {footer.whatsappContact && (
          <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-1.5 rounded-full shadow font-extrabold text-xs sm:text-sm tracking-wide">
            <MessageSquare size={16} />
            <span>WhatsApp: {footer.whatsappContact}</span>
          </div>
        )}

        {footer.emailOrWeb && (
          <p className="text-xs font-semibold text-slate-600">
            {footer.emailOrWeb}
          </p>
        )}

        {footer.nutritionalNote && (
          <p className="text-[11px] text-slate-500 max-w-lg mt-1 italic">
            {footer.nutritionalNote}
          </p>
        )}
      </div>
    </div>
  );
};
