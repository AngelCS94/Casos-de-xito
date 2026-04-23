"use client";

import { useEffect, useMemo } from "react";
import type { SlideContent } from "@/types/slide";

interface SlidePreviewProps {
  data: SlideContent;
  caseImages?: File[];
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1 text-sm text-slate-700">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function SlidePreview({ data, caseImages = [] }: SlidePreviewProps) {
  const imageUrls = useMemo(() => {
    return caseImages.map((file) => URL.createObjectURL(file));
  }, [caseImages]);

  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Vista previa estructurada</h2>

      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="space-y-4 bg-white p-5 md:col-span-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">{data.header}</p>
            <h3 className="text-xl font-bold leading-tight text-slate-900">{data.title}</h3>

            <div>
              <h4 className="text-sm font-bold text-sky-700">{data.challenge.title}</h4>
              <p className="mt-1 text-sm text-slate-700">{data.challenge.body}</p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-sky-700">{data.approach.title}</h4>
              <p className="mt-1 text-sm text-slate-700">{data.approach.intro}</p>
              <div className="mt-2">
                <BulletList items={data.approach.bullets} />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-sky-700">{data.impact.title}</h4>
              <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                <BulletList items={data.impact.bullets_left} />
                {data.impact.bullets_right.length > 0 ? (
                  <BulletList items={data.impact.bullets_right} />
                ) : (
                  <p className="text-xs italic text-slate-400">Sin segunda columna</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2 bg-sky-100 p-4 md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-900">Panel visual</p>
            <p className="text-xs text-sky-900">{data.visual_panel.visual_summary}</p>
            {imageUrls.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {imageUrls.map((url, index) => (
                  <div key={url} className={index === 0 && imageUrls.length === 3 ? "col-span-2" : ""}>
                    <img
                      src={url}
                      alt={`Imagen del caso ${index + 1}`}
                      className="h-32 w-full rounded-md border border-sky-300 object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  {data.visual_panel.asset_suggestions.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="rounded-md border border-sky-300 bg-white p-2 text-[11px] font-medium text-sky-900"
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="rounded-md border border-dashed border-sky-300 bg-sky-50 p-2 text-xs text-sky-800">
                  Collage placeholder para capturas o imagenes.
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {data.logos.length > 0 && (
        <p className="mt-3 text-xs text-slate-500">Logos sugeridos: {data.logos.join(" | ")}</p>
      )}
    </section>
  );
}
