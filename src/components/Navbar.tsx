import React, { useState } from 'react';
import {
  Printer,
  Download,
  FileDown,
  Wand2,
  Save,
  Check,
  Utensils,
  Loader2,
  ExternalLink,
  X,
  FileCheck,
} from 'lucide-react';
import { WeeklyMenu, TemplateId } from '../types';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { LogoRenderer } from './LogoRenderer';

interface NavbarProps {
  currentMenu: WeeklyMenu;
  onChangeTemplate: (templateId: TemplateId) => void;
  onOpenAiModal: () => void;
  onResetMenu: () => void;
  onSaveLocal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMenu,
  onChangeTemplate,
  onOpenAiModal,
  onResetMenu,
  onSaveLocal,
}) => {
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // States for download ready modal
  const [pdfReadyData, setPdfReadyData] = useState<{ url: string; fileName: string } | null>(null);
  const [pngReadyData, setPngReadyData] = useState<{ url: string; fileName: string } | null>(null);

  // Print function using browser native print
  const handlePrint = () => {
    try {
      window.focus();
      window.print();
    } catch (e) {
      console.error('Print error:', e);
      window.print();
    }
  };

  // Helper to generate normalized filename based on week range (e.g., MENU-DEL-10-AL-14-DE-AGOSTO-2026.pdf)
  const generateFormattedFileName = (ext: 'pdf' | 'png'): string => {
    const rawWeek = currentMenu.header.weekRangeText || '';

    // Remove "SEMANA:" prefix if present
    let cleanWeek = rawWeek
      .replace(/^SEMANA\s*:\s*/i, '')
      .replace(/^SEMANA\s+/i, '')
      .trim();

    if (cleanWeek) {
      // Normalize to uppercase and convert non-alphanumeric characters to single hyphens
      const slug = cleanWeek
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      if (slug.startsWith('MENU-')) {
        return `${slug}.${ext}`;
      } else {
        return `MENU-${slug}.${ext}`;
      }
    }

    // Default fallback if week range text is completely missing
    return `MENU-DEL-10-AL-14-DE-AGOSTO-2026.${ext}`;
  };

  // Direct PDF Download using html-to-image + jsPDF with Blob URL
  const handleExportPdf = async () => {
    const el = document.getElementById('menu-printable-area');
    if (!el) {
      alert('No se encontró el área del menú para exportar.');
      return;
    }

    try {
      setIsExportingPdf(true);

      // Force complete unclipped capture width and height
      const captureWidth = Math.max(el.scrollWidth, el.offsetWidth, 960);
      const captureHeight = Math.max(el.scrollHeight, el.offsetHeight);

      const dataUrl = await toPng(el, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
        width: captureWidth,
        height: captureHeight,
        style: {
          transform: 'none',
          width: `${captureWidth}px`,
          minWidth: `${captureWidth}px`,
          maxWidth: 'none',
          margin: '0 auto',
          overflow: 'visible',
        },
      });

      // Load image dimensions
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = (err) => reject(err);
      });

      const imgWidth = img.naturalWidth || img.width;
      const imgHeight = img.naturalHeight || img.height;

      // Determine orientation based on aspect ratio
      const isLandscape = imgWidth > imgHeight;
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const margin = 8; // 8mm margin
      const maxWidth = pdfWidth - margin * 2;
      const maxHeight = pdfHeight - margin * 2;

      let renderWidth = maxWidth;
      let renderHeight = (imgHeight * maxWidth) / imgWidth;

      if (renderHeight > maxHeight) {
        renderHeight = maxHeight;
        renderWidth = (imgWidth * maxHeight) / imgHeight;
      }

      const x = (pdfWidth - renderWidth) / 2;
      const y = (pdfHeight - renderHeight) / 2;

      pdf.addImage(dataUrl, 'PNG', x, y, renderWidth, renderHeight);

      const fileName = generateFormattedFileName('pdf');

      // Generate Blob URL for maximum browser compatibility
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);

      // Attempt direct download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show download modal with direct link
      setPdfReadyData({
        url: blobUrl,
        fileName,
      });
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Ocurrió un error al generar el PDF. Puedes utilizar el botón "Imprimir" para guardar como PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Export as PNG image using html-to-image
  const handleExportPng = async () => {
    const el = document.getElementById('menu-printable-area');
    if (!el) return;

    try {
      setIsExportingPng(true);

      const captureWidth = Math.max(el.scrollWidth, el.offsetWidth, 960);
      const captureHeight = Math.max(el.scrollHeight, el.offsetHeight);

      const dataUrl = await toPng(el, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
        width: captureWidth,
        height: captureHeight,
        style: {
          transform: 'none',
          width: `${captureWidth}px`,
          minWidth: `${captureWidth}px`,
          maxWidth: 'none',
          margin: '0 auto',
          overflow: 'visible',
        },
      });

      const fileName = generateFormattedFileName('png');

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setPngReadyData({
        url: dataUrl,
        fileName,
      });
    } catch (err) {
      console.error('Error exporting image:', err);
      alert('Error al generar la imagen PNG.');
    } finally {
      setIsExportingPng(false);
    }
  };

  const triggerSaveToast = () => {
    onSaveLocal();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <>
      <header className="bg-slate-900 text-white border-b border-slate-800 px-3 sm:px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2 sm:gap-3 sticky top-0 z-40 shadow-md no-print">
        {/* Left: App title & Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-md shrink-0 border border-amber-400/60 bg-white flex items-center justify-center">
            <LogoRenderer
              logoUrl={currentMenu.header.leftLogoUrl}
              logoType={currentMenu.header.leftLogoType}
              className="w-8 h-8 sm:w-10 sm:h-10"
              iconSize={20}
            />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-lg tracking-tight flex items-center gap-1.5">
              <span>FoodClass</span>
              <span className="text-[10px] sm:text-xs bg-purple-500/30 text-purple-200 border border-purple-400/30 px-1.5 sm:px-2 py-0.5 rounded-full font-bold">
                v2.0
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium hidden md:block">
              Generador de Menús Semanales Escolares y Nutricionales
            </p>
          </div>
        </div>

        {/* Center: Quick Template selector pills */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          {[
            { id: 'school-fun', name: 'Escolar' },
            { id: 'minimal-modern', name: 'Minimal' },
            { id: 'healthy-vibrant', name: 'Salud' },
            { id: 'pastel-rainbow', name: 'Pastel' },
            { id: 'boutique-bistro', name: 'Boutique' },
            { id: 'grid-executive', name: 'Grilla' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => onChangeTemplate(t.id as TemplateId)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                currentMenu.theme.templateId === t.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <button
            onClick={onOpenAiModal}
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow inline-flex items-center gap-1 sm:gap-1.5 transition-all shrink-0"
          >
            <Wand2 size={14} />
            <span className="hidden xs:inline">IA</span>
            <span className="hidden sm:inline">Generar con</span>
          </button>

          <button
            onClick={triggerSaveToast}
            className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 font-bold text-xs inline-flex items-center gap-1 transition-all shrink-0"
            title="Guardar en navegador"
          >
            {saveToast ? <Check size={15} className="text-emerald-400" /> : <Save size={15} />}
            <span className="hidden md:inline">{saveToast ? 'Guardado' : 'Guardar'}</span>
          </button>

          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md inline-flex items-center gap-1 sm:gap-1.5 transition-all disabled:opacity-50 shrink-0"
            title="Descargar menú directamente como archivo PDF"
          >
            {isExportingPdf ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span className="text-[11px] sm:text-xs">PDF...</span>
              </>
            ) : (
              <>
                <FileDown size={15} />
                <span>Descargar PDF</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportPng}
            disabled={isExportingPng}
            className="px-2 sm:px-3 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow inline-flex items-center gap-1 sm:gap-1.5 transition-all disabled:opacity-50 shrink-0"
            title="Exportar como imagen PNG"
          >
            <Download size={14} />
            <span>PNG</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 font-bold text-xs inline-flex items-center gap-1 transition-all shrink-0"
            title="Abrir diálogo de impresión"
          >
            <Printer size={15} />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
        </div>
      </header>

      {/* PDF Ready Modal (fallback for iframe sandboxes) */}
      {pdfReadyData && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative text-slate-900">
            <button
              onClick={() => setPdfReadyData(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                <FileCheck size={28} />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                  ¡Tu documento PDF está listo!
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {pdfReadyData.fileName}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed">
              Si tu navegador no inició la descarga automáticamente, haz clic en el botón verde de abajo para guardar el PDF o en 'Abrir en nueva pestaña'.
            </p>

            <div className="space-y-2.5">
              <a
                href={pdfReadyData.url}
                download={pdfReadyData.fileName}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <FileDown size={18} />
                <span>Descargar Archivo PDF</span>
              </a>

              <a
                href={pdfReadyData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-200"
              >
                <ExternalLink size={16} />
                <span>Abrir en Nueva Pestaña / Imprimir</span>
              </a>

              <button
                onClick={handlePrint}
                className="w-full py-2 text-slate-500 hover:text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer size={15} />
                <span>O bien usa el cuadro de impresión directa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PNG Ready Modal */}
      {pngReadyData && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative text-slate-900">
            <button
              onClick={() => setPngReadyData(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center">
                <Download size={28} />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                  ¡Imagen PNG lista!
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {pngReadyData.fileName}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 mt-4">
              <a
                href={pngReadyData.url}
                download={pngReadyData.fileName}
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Download size={18} />
                <span>Guardar Imagen PNG</span>
              </a>

              <a
                href={pngReadyData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-200"
              >
                <ExternalLink size={16} />
                <span>Ver Imagen en Nueva Pestaña</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

