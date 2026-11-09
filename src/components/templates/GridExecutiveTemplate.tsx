import React from 'react';
import { WeeklyMenu } from '../../types';
import { LogoRenderer } from '../LogoRenderer';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import { FOOD_TAGS } from '../../data/defaultData';

interface TemplateProps {
  menu: WeeklyMenu;
  onEditCell?: (dayId: string, colId: string) => void;
}

export const GridExecutiveTemplate: React.FC<TemplateProps> = ({ menu, onEditCell }) => {
  const { header, footer, columns, days, theme } = menu;

  const getTagEmoji = (tagId?: string) => {
    if (!tagId) return '•';
    const tag = FOOD_TAGS.find((t) => t.id === tagId);
    return tag ? tag.emoji : '•';
  };

  return (
    <div
      id="menu-printable-area"
      className="w-full max-w-4xl min-w-[880px] mx-auto bg-white p-6 sm:p-8 border-2 border-slate-900 font-sans text-slate-900 transition-all select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-4">
        <div className="flex items-center gap-4">
          <LogoRenderer
            logoUrl={header.leftLogoUrl}
            logoType={header.leftLogoType}
            altText="Logo"
            className="w-16 h-16"
            iconSize={32}
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950">
              {header.institutionName || 'REPORTE DE MENÚ SEMANAL'}
            </h1>
            <h2 className="text-sm font-bold text-slate-700 uppercase">{header.subtitle || 'MENÚ GENERAL'}</h2>
            <p className="text-xs font-mono font-semibold text-slate-600 mt-0.5">
              {header.weekRangeText || 'SEMANA DEL 10 AL 14 DE AGOSTO - 2026'}
            </p>
          </div>
        </div>

        {header.rightLogoUrl && (
          <LogoRenderer
            logoUrl={header.rightLogoUrl}
            logoType={header.rightLogoType}
            altText="Logo"
            className="w-16 h-16"
            iconSize={32}
          />
        )}
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto border-2 border-slate-900 mb-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider">
              <th className="py-2.5 px-3 border-r border-slate-700 text-center w-24 bg-black">DÍA</th>
              {columns.map((col) => (
                <th key={col.id} className="py-2.5 px-3 border-r last:border-r-0 border-slate-700 text-center">
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900 text-xs font-medium">
            {days.map((day, idx) => (
              <tr key={day.dayId} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="py-3 px-2 border-r border-slate-900 font-extrabold text-center uppercase bg-slate-200">
                  <div>{day.dayName}</div>
                  {day.dateLabel && <div className="text-[10px] text-slate-600">{day.dateLabel}</div>}
                </td>

                {columns.map((col) => {
                  const meal = day.meals[col.id] || { items: [] };
                  const activeItems = (meal.items || []).filter((item) => item && item.trim().length > 0);
                  return (
                    <td
                      key={col.id}
                      onClick={() => onEditCell && onEditCell(day.dayId, col.id)}
                      className="py-2.5 px-3 border-r last:border-r-0 border-slate-900 align-top cursor-pointer hover:bg-yellow-50"
                    >
                      {activeItems.length > 0 ? (
                        <ul className="list-disc list-inside space-y-0.5">
                          {activeItems.map((item, i) => (
                            <li key={i} className="text-slate-900">
                              <span className="font-semibold">{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-400 italic">--</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs font-semibold border-t-2 border-slate-900 pt-3 text-slate-800">
        <p>"{footer.slogan || 'Alimentación institucional certificada'}"</p>
        {footer.whatsappContact && (
          <a
            href={getWhatsAppUrl(footer.whatsappContact)}
            target="_blank"
            rel="noopener noreferrer"
            data-whatsapp-link="true"
            className="hover:text-emerald-700 hover:underline transition-colors"
            title="Abrir chat en WhatsApp"
          >
            WhatsApp: {footer.whatsappContact}
          </a>
        )}
      </div>
    </div>
  );
};
