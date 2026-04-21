import type { SlideSchema } from "@/lib/schema";

type SlidePreviewProps = {
  slide: SlideSchema | null;
};

function renderBullets(items: string[]) {
  return (
    <ul className="list-disc pl-4 space-y-1">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export function SlidePreview({ slide }: SlidePreviewProps) {
  if (!slide) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
        Aquí verás la vista previa estructurada antes de descargar el PPTX.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-5 min-h-[520px]">
        <section className="col-span-3 p-6 text-slate-800">
          <p className="text-xs font-semibold text-slate-500">{slide.header}</p>
          <h2 className="mt-2 text-2xl font-bold leading-tight text-slate-900">{slide.title}</h2>

          <div className="mt-5 space-y-4 text-sm">
            <div>
              <h3 className="font-semibold text-blue-700">{slide.challenge.title}</h3>
              <p className="mt-1 leading-relaxed">{slide.challenge.body}</p>
            </div>

            <div>
              <h3 className="font-semibold text-blue-700">{slide.approach.title}</h3>
              <p className="mt-1">{slide.approach.intro}</p>
              <div className="mt-2">{renderBullets(slide.approach.bullets)}</div>
            </div>

            <div>
              <h3 className="font-semibold text-blue-700">{slide.impact.title}</h3>
              <div className={`mt-2 grid gap-4 ${slide.impact.bullets_right.length > 0 ? "grid-cols-2" : "grid-cols-1"}`}>
                <div>{renderBullets(slide.impact.bullets_left)}</div>
                {slide.impact.bullets_right.length > 0 && <div>{renderBullets(slide.impact.bullets_right)}</div>}
              </div>
            </div>
          </div>
        </section>

        <aside className="col-span-2 bg-blue-50 p-5">
          <h3 className="text-sm font-semibold text-blue-800">Panel visual (collage)</h3>
          <p className="mt-1 text-xs text-slate-600">{slide.visual_panel.visual_summary}</p>
          <div className="mt-4 space-y-3">
            {slide.visual_panel.asset_suggestions.map((suggestion, index) => (
              <div key={index} className="rounded-lg border border-blue-200 bg-blue-100 p-3 text-xs text-blue-900">
                {suggestion}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
