import React from 'react';
import { WeeklyMenu } from '../../types';
import { LogoRenderer } from '../LogoRenderer';
import { FOOD_TAGS } from '../../data/defaultData';
import { Utensils, Star } from 'lucide-react';

interface TemplateProps {
  menu: WeeklyMenu;
  onEditCell?: (dayId: string, colId: string) => void;
}

export const BoutiqueTemplate: React.FC<TemplateProps> = ({ menu, onEditCell }) => {
  const { header, footer, columns, days, theme } = menu;

  const getTagEmoji = (tagId?: string) => {
    if (!tagId) return '⚜';
    const tag = FOOD_TAGS.find((t) => t.id === tagId);
    return tag ? tag.emoji : '⚜';
  };

  return (
    <div
      id="menu-printable-area"
      className="w-full max-w-4xl min-w-[880px] mx-auto bg-stone-50 p-6 sm:p-10 rounded-xl border-2 border-amber-900/20 shadow-2xl font-serif text-amber-950 transition-all select-none relative"
    >
      {/* Outer double border line */}
      <div className="border border-amber-800/30 p-4 sm:p-6 rounded-lg bg-stone-100/50">
        {/* HEADER */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-amber-800/30 mb-6">
          <div className="flex items-center justify-center gap-6 mb-3 w-full">
            <LogoRenderer
              logoUrl={header.leftLogoUrl}
              logoType={header.leftLogoType}
              altText="Logo Izquierdo"
              className="w-16 h-16 sm:w-20 sm:h-20"
              iconSize={36}
            />
            <div className="text-center px-2">
              <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-amber-800">
                {header.badgeText || 'Servicio de Gastronomía & Catering'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-950 tracking-wider uppercase mt-1">
                {header.institutionName || 'ERIKA CATERING BISTRO'}
              </h1>
              <h2 className="text-base font-serif italic text-amber-800 tracking-wide mt-0.5">
                {header.subtitle || 'Menú Gastronómico Semanal'}
              </h2>
            </div>
            {header.rightLogoUrl && (
              <LogoRenderer
                logoUrl={header.rightLogoUrl}
                logoType={header.rightLogoType}
                altText="Logo Derecho"
                className="w-16 h-16 sm:w-20 sm:h-20"
                iconSize={36}
              />
            )}
          </div>

          <div className="mt-2 text-xs font-sans uppercase tracking-widest text-stone-600 border-y border-amber-800/20 py-1 px-6">
            {header.weekRangeText || 'SEMANA DEL 10 AL 14 DE AGOSTO - 2026'}
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-md border border-amber-800/30 bg-white mb-6 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-amber-950 text-amber-100 font-sans uppercase text-xs tracking-wider">
                <th className="py-3 px-4 border-r border-amber-800 text-center w-28 bg-amber-900">
                  Día
                </th>
                {columns.map((col) => (
                  <th key={col.id} className="py-3 px-4 border-r last:border-r-0 border-amber-800 text-center">
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-xs sm:text-sm font-serif">
              {days.map((day) => (
                <tr key={day.dayId} className="hover:bg-amber-50/40 transition-colors">
                  <td className="py-4 px-3 border-r border-stone-200 text-center font-bold text-amber-950 bg-stone-100/80 uppercase font-sans text-xs tracking-wider">
                    <div>{day.dayName}</div>
                    {day.dateLabel && (
                      <div className="text-[10px] font-normal text-amber-800 mt-0.5">{day.dateLabel}</div>
                    )}
                  </td>

                  {columns.map((col) => {
                    const meal = day.meals[col.id] || { items: [] };
                    const activeItems = (meal.items || []).filter((item) => item && item.trim().length > 0);
                    return (
                      <td
                        key={col.id}
                        onClick={() => onEditCell && onEditCell(day.dayId, col.id)}
                        className="py-3.5 px-4 border-r last:border-r-0 border-stone-200 align-top cursor-pointer hover:bg-stone-50 transition-colors"
                      >
                        <div className="space-y-1">
                          {activeItems.length > 0 ? (
                            activeItems.map((item, i) => (
                              <div key={i} className="flex items-start gap-1.5 leading-snug">
                                {theme.showFoodIcons && (
                                  <span className="text-xs text-amber-700 mt-0.5 select-none">
                                    {getTagEmoji(meal.iconTag)}
                                  </span>
                                )}
                                <span className="font-serif text-slate-900">{item}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-stone-400 italic text-xs">Sin menú</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="text-center pt-2 font-serif text-amber-950 space-y-2">
          <p className="italic text-base sm:text-lg">"{footer.slogan || 'El arte de comer bien cada día.'}"</p>
          {footer.whatsappContact && (
            <p className="text-xs font-sans tracking-wider text-amber-900 font-semibold">
              INFORMES Y PEDIDOS | WHATSAPP: {footer.whatsappContact}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
