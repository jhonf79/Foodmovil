import React from 'react';
import { WeeklyMenu } from '../../types';
import { LogoRenderer } from '../LogoRenderer';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import { FOOD_TAGS } from '../../data/defaultData';
import { Phone, Globe, CheckCircle2 } from 'lucide-react';

interface TemplateProps {
  menu: WeeklyMenu;
  onEditCell?: (dayId: string, colId: string) => void;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ menu, onEditCell }) => {
  const { header, footer, columns, days, theme } = menu;

  const getTagEmoji = (tagId?: string) => {
    if (!tagId) return '▪';
    const tag = FOOD_TAGS.find((t) => t.id === tagId);
    return tag ? tag.emoji : '▪';
  };

  return (
    <div
      id="menu-printable-area"
      className="w-full max-w-4xl min-w-[880px] mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-lg font-sans text-slate-800 transition-all select-none"
    >
      {/* Top Header line */}
      <div className="h-2 w-full bg-slate-900 rounded-t-lg mb-6" />

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200 mb-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <LogoRenderer
            logoUrl={header.leftLogoUrl}
            logoType={header.leftLogoType}
            altText="Logo Izquierdo"
            className="w-16 h-16 sm:w-20 sm:h-20"
            iconSize={36}
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 uppercase">
              {header.institutionName || 'INSTITUCIÓN ACADÉMICA'}
            </h1>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
              {header.subtitle || 'PROGRAMA DE NUTRICIÓN SEMANAL'}
            </p>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md border border-slate-200">
              <span>{header.weekRangeText || 'SEMANA DEL 10 AL 14 DE AGOSTO - 2026'}</span>
            </div>
          </div>
        </div>

        {header.rightLogoUrl && (
          <div className="hidden sm:block">
            <LogoRenderer
              logoUrl={header.rightLogoUrl}
              logoType={header.rightLogoType}
              altText="Logo Derecho"
              className="w-16 h-16"
              iconSize={32}
            />
          </div>
        )}
      </div>

      {/* TABLE SECTION */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white font-semibold text-xs tracking-wider uppercase">
              <th className="py-3 px-4 border-r border-slate-800 text-center w-28 bg-slate-950">
                Día
              </th>
              {columns.map((col) => (
                <th key={col.id} className="py-3 px-4 border-r last:border-r-0 border-slate-800 text-center">
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
            {days.map((day) => (
              <tr key={day.dayId} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-3 border-r border-slate-200 font-bold text-center text-slate-900 bg-slate-50/60 uppercase text-xs">
                  <div>{day.dayName}</div>
                  {day.dateLabel && (
                    <div className="text-[10px] font-normal text-slate-500 mt-0.5">
                      {day.dateLabel}
                    </div>
                  )}
                </td>

                {columns.map((col) => {
                  const meal = day.meals[col.id] || { items: [] };
                  const activeItems = (meal.items || []).filter((item) => item && item.trim().length > 0);
                  return (
                    <td
                      key={col.id}
                      onClick={() => onEditCell && onEditCell(day.dayId, col.id)}
                      className="py-3 px-4 border-r last:border-r-0 border-slate-200 align-top cursor-pointer hover:bg-slate-100/60 transition-colors"
                    >
                      <div className="space-y-1">
                        {activeItems.length > 0 ? (
                          activeItems.map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-slate-700">
                              {theme.showFoodIcons && (
                                <span className="text-xs text-slate-400">{getTagEmoji(meal.iconTag)}</span>
                              )}
                              <span className="font-medium">{item}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-400 italic text-xs">Sin menú</span>
                        )}

                        {meal.calories && (
                          <div className="text-[10px] text-slate-500 font-mono mt-1">
                            {meal.calories}
                          </div>
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

      {/* FOOTER SECTION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 text-xs text-slate-600">
        <p className="font-medium italic text-slate-800">
          "{footer.slogan || 'Alimentación balanceada para la excelencia'}"
        </p>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          {footer.whatsappContact && (
            <a
              href={getWhatsAppUrl(footer.whatsappContact)}
              target="_blank"
              rel="noopener noreferrer"
              data-whatsapp-link="true"
              className="flex items-center gap-1 hover:text-emerald-700 hover:underline transition-colors"
              title="Abrir chat en WhatsApp"
            >
              <strong>Contacto:</strong> {footer.whatsappContact}
            </a>
          )}
          {footer.emailOrWeb && <span>{footer.emailOrWeb}</span>}
        </div>
      </div>
    </div>
  );
};
