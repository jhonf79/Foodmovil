import React from 'react';
import { WeeklyMenu } from '../../types';
import { LogoRenderer } from '../LogoRenderer';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import { FOOD_TAGS } from '../../data/defaultData';
import { Leaf, ShieldCheck, HeartPulse, Check } from 'lucide-react';

interface TemplateProps {
  menu: WeeklyMenu;
  onEditCell?: (dayId: string, colId: string) => void;
}

export const HealthyTemplate: React.FC<TemplateProps> = ({ menu, onEditCell }) => {
  const { header, footer, columns, days, theme } = menu;

  const getTagEmoji = (tagId?: string) => {
    if (!tagId) return '🌱';
    const tag = FOOD_TAGS.find((t) => t.id === tagId);
    return tag ? tag.emoji : '🌱';
  };

  return (
    <div
      id="menu-printable-area"
      className="w-full max-w-4xl min-w-[880px] mx-auto bg-emerald-50/30 p-6 sm:p-8 rounded-3xl border-2 border-emerald-200 shadow-xl font-sans text-slate-800 transition-all select-none"
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between px-4 py-2 bg-emerald-700 text-emerald-50 rounded-2xl text-xs font-bold tracking-wider mb-6 shadow-sm">
        <span className="flex items-center gap-1.5">
          <Leaf size={16} /> PROGRAMA DE SALUD & NUTRICIÓN BALANCEADA
        </span>
        <span className="flex items-center gap-1">
          <ShieldCheck size={16} /> CERTIFICACIÓN NUTRICIONAL
        </span>
      </div>

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b-2 border-emerald-200 mb-6 text-center sm:text-left">
        <div className="flex items-center gap-4">
          <LogoRenderer
            logoUrl={header.leftLogoUrl}
            logoType={header.leftLogoType}
            altText="Logo Izquierdo"
            className="w-20 h-20"
            iconSize={40}
          />
          <div>
            <h1 className="text-2xl font-black text-emerald-950 uppercase tracking-tight">
              {header.institutionName || 'CENTRO NUTRICIONAL'}
            </h1>
            <h2 className="text-base font-extrabold text-emerald-700 tracking-wide uppercase">
              {header.subtitle || 'MENÚ SALUDABLE SEMANAL'}
            </h2>
            <div className="mt-1 text-xs font-bold text-slate-600 bg-white/80 border border-emerald-200 px-3 py-0.5 rounded-full inline-block">
              {header.weekRangeText || 'SEMANA DEL 10 AL 14 DE AGOSTO - 2026'}
            </div>
          </div>
        </div>

        {header.rightLogoUrl && (
          <LogoRenderer
            logoUrl={header.rightLogoUrl}
            logoType={header.rightLogoType}
            altText="Logo Derecho"
            className="w-20 h-20"
            iconSize={40}
          />
        )}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-emerald-300 bg-white shadow-md mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-600 text-white font-black text-xs uppercase tracking-wider">
              <th className="py-3.5 px-4 border-r border-emerald-500 text-center w-28 bg-emerald-700">
                Día
              </th>
              {columns.map((col) => (
                <th key={col.id} className="py-3.5 px-4 border-r last:border-r-0 border-emerald-500 text-center">
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100 text-xs sm:text-sm">
            {days.map((day) => (
              <tr key={day.dayId} className="hover:bg-emerald-50/50 transition-colors">
                <td className="py-4 px-3 border-r border-emerald-200 font-extrabold text-center text-emerald-900 bg-emerald-100/40 uppercase">
                  <div className="flex items-center justify-center gap-1">
                    <HeartPulse size={14} className="text-emerald-600" />
                    <span>{day.dayName}</span>
                  </div>
                  {day.dateLabel && (
                    <div className="text-[10px] font-semibold text-emerald-700/70 mt-0.5">
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
                      className="py-3 px-4 border-r last:border-r-0 border-emerald-100 align-top cursor-pointer hover:bg-emerald-50/80 transition-colors"
                    >
                      <div className="space-y-1.5">
                        {activeItems.length > 0 ? (
                          activeItems.map((item, i) => (
                            <div key={i} className="flex items-start gap-1.5 leading-tight">
                              <span className="text-sm select-none">{getTagEmoji(meal.iconTag)}</span>
                              <span className="font-bold text-slate-800">{item}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-400 italic text-xs">Sin menú</span>
                        )}

                        {meal.calories && (
                          <span className="inline-block mt-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                            {meal.calories}
                          </span>
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
      <div className="bg-white/80 p-4 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div>
          <p className="font-bold text-emerald-900 italic">
            "{footer.slogan || 'Alimentos vivos y naturales para una vida activa y plena.'}"
          </p>
          {footer.nutritionalNote && (
            <p className="text-[11px] text-slate-500 mt-0.5">{footer.nutritionalNote}</p>
          )}
        </div>

        {footer.whatsappContact && (
          <a
            href={getWhatsAppUrl(footer.whatsappContact)}
            target="_blank"
            rel="noopener noreferrer"
            data-whatsapp-link="true"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-1.5 rounded-xl shadow-sm text-xs transition-colors"
            title="Abrir chat en WhatsApp"
          >
            Contacto WhatsApp: {footer.whatsappContact}
          </a>
        )}
      </div>
    </div>
  );
};
