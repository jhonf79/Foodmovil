import React from 'react';
import { WeeklyMenu } from '../../types';
import { LogoRenderer } from '../LogoRenderer';
import { FOOD_TAGS } from '../../data/defaultData';
import { Smile, Sun, Heart } from 'lucide-react';

interface TemplateProps {
  menu: WeeklyMenu;
  onEditCell?: (dayId: string, colId: string) => void;
}

const ROW_PASTEL_COLORS = [
  'bg-emerald-50/70 border-emerald-100',
  'bg-violet-50/70 border-violet-100',
  'bg-orange-50/70 border-orange-100',
  'bg-amber-50/70 border-amber-100',
  'bg-sky-50/70 border-sky-100',
  'bg-pink-50/70 border-pink-100',
  'bg-teal-50/70 border-teal-100',
];

export const PastelTemplate: React.FC<TemplateProps> = ({ menu, onEditCell }) => {
  const { header, footer, columns, days, theme } = menu;

  const getTagEmoji = (tagId?: string) => {
    if (!tagId) return '🌟';
    const tag = FOOD_TAGS.find((t) => t.id === tagId);
    return tag ? tag.emoji : '🌟';
  };

  return (
    <div
      id="menu-printable-area"
      className="w-full max-w-4xl min-w-[880px] mx-auto bg-gradient-to-b from-purple-50 via-pink-50/40 to-sky-50 p-6 sm:p-8 rounded-3xl border-4 border-white shadow-xl font-sans transition-all select-none"
    >
      {/* HEADER */}
      <div className="flex flex-col items-center text-center pb-6 border-b-2 border-dashed border-pink-300 mb-6">
        <div className="flex items-center justify-between w-full gap-4 mb-2">
          <LogoRenderer
            logoUrl={header.leftLogoUrl}
            logoType={header.leftLogoType}
            altText="Logo Izquierdo"
            className="w-18 h-18 sm:w-22 sm:h-22"
            iconSize={38}
          />
          <div className="flex-1 px-2">
            <span className="inline-block bg-pink-200 text-pink-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-1">
              {header.badgeText || 'Jardín Infantil & Preescolar'}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-purple-900 tracking-wide uppercase">
              {header.institutionName || 'JARDÍN ARCOÍRIS'}
            </h1>
            <h2 className="text-lg font-black text-pink-600 uppercase mt-0.5">
              {header.subtitle || 'MENÚ DELICIOSO Y DIVERTIDO'}
            </h2>
            <div className="mt-2 inline-block bg-white border-2 border-purple-200 px-4 py-1 rounded-full text-xs font-extrabold text-slate-700 shadow-sm">
              {header.weekRangeText || 'SEMANA DEL 10 AL 14 DE AGOSTO - 2026'}
            </div>
          </div>
          {header.rightLogoUrl && (
            <LogoRenderer
              logoUrl={header.rightLogoUrl}
              logoType={header.rightLogoType}
              altText="Logo Derecho"
              className="w-18 h-18 sm:w-22 sm:h-22"
              iconSize={38}
            />
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border-2 border-white bg-white/90 shadow-md mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-purple-400 via-pink-400 to-sky-400 text-white font-black text-xs uppercase tracking-wider">
              <th className="py-3.5 px-4 border-r border-white/40 text-center w-28 bg-purple-500">
                Día
              </th>
              {columns.map((col) => (
                <th key={col.id} className="py-3.5 px-4 border-r last:border-r-0 border-white/40 text-center">
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-100 text-xs sm:text-sm">
            {days.map((day, idx) => {
              const bgClass = ROW_PASTEL_COLORS[idx % ROW_PASTEL_COLORS.length];
              return (
                <tr key={day.dayId} className={`${bgClass} hover:opacity-90 transition-opacity`}>
                  <td className="py-4 px-3 border-r border-purple-100 font-black text-center text-purple-950 uppercase">
                    <div className="text-sm">{day.dayName}</div>
                    {day.dateLabel && (
                      <div className="text-[10px] font-bold text-purple-700/80 mt-0.5">{day.dateLabel}</div>
                    )}
                  </td>

                  {columns.map((col) => {
                    const meal = day.meals[col.id] || { items: [] };
                    const activeItems = (meal.items || []).filter((item) => item && item.trim().length > 0);
                    return (
                      <td
                        key={col.id}
                        onClick={() => onEditCell && onEditCell(day.dayId, col.id)}
                        className="py-3 px-4 border-r last:border-r-0 border-purple-100 align-top cursor-pointer hover:bg-white/80 transition-colors"
                      >
                        <div className="space-y-1">
                          {activeItems.length > 0 ? (
                            activeItems.map((item, i) => (
                              <div key={i} className="flex items-start gap-1.5 leading-tight">
                                {theme.showFoodIcons && (
                                  <span className="text-sm select-none">{getTagEmoji(meal.iconTag)}</span>
                                )}
                                <span className="font-bold text-slate-800">{item}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-slate-400 italic text-xs">Sin menú</span>
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

      {/* FOOTER */}
      <div className="text-center pt-2 space-y-2">
        <p className="font-black text-purple-900 text-base italic">
          "{footer.slogan || '¡Creciendo sanos, felices y con mucha energía!'}"
        </p>
        {footer.whatsappContact && (
          <div className="inline-block bg-pink-500 text-white font-black px-4 py-1.5 rounded-full text-xs shadow-md">
            Atención WhatsApp: {footer.whatsappContact}
          </div>
        )}
      </div>
    </div>
  );
};
