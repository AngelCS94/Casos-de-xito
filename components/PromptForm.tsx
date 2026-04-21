"use client";

type PromptFormProps = {
  prompt: string;
  language: string;
  loading: boolean;
  onPromptChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onGenerate: () => void;
};

export function PromptForm({
  prompt,
  language,
  loading,
  onPromptChange,
  onLanguageChange,
  onGenerate,
}: PromptFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="prompt" className="text-sm font-semibold text-slate-700">
          Briefing del nuevo caso
        </label>
        <textarea
          id="prompt"
          rows={5}
          value={prompt}
          onChange={(event) => onPromptChange(event.target.value)}
          placeholder="Describe sector, reto, trabajo realizado e impacto esperado"
          className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="language" className="text-sm font-semibold text-slate-700">
          Idioma
        </label>
        <select
          id="language"
          value={language}
          onChange={(event) => onLanguageChange(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-sm text-slate-800"
        >
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={loading}
        className="w-full rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Generando..." : "Generar caso de éxito"}
      </button>
    </div>
  );
}
