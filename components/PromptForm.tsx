"use client";

interface PromptFormProps {
  prompt: string;
  language: string;
  disabled?: boolean;
  onPromptChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onSubmit: () => void;
}

export function PromptForm({
  prompt,
  language,
  disabled,
  onPromptChange,
  onLanguageChange,
  onSubmit,
}: PromptFormProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Briefing del nuevo caso</h2>
      <p className="mt-1 text-sm text-slate-600">
        Describe en pocas lineas el cliente, objetivo, solucion e impacto esperado.
      </p>

      <textarea
        className="mt-4 min-h-36 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
        value={prompt}
        placeholder="Ejemplo: Caso para retailer nacional. Necesitamos contar como optimizamos la estrategia de CRM y activaciones omnicanal para aumentar relevancia y acelerar conversion comercial."
        onChange={(event) => onPromptChange(event.target.value)}
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="text-sm text-slate-700" htmlFor="language-select">
          Idioma
        </label>
        <select
          id="language-select"
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          value={language}
          onChange={(event) => onLanguageChange(event.target.value)}
        >
          <option value="ES">ES</option>
          <option value="EN">EN</option>
          <option value="PT">PT</option>
        </select>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onSubmit}
        className="mt-5 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Generar caso de exito
      </button>
    </section>
  );
}
