"use client";

import { useMemo, useState } from "react";
import { CaseImageUploader } from "@/components/CaseImageUploader";
import { ExampleUploader } from "@/components/ExampleUploader";
import { PromptForm } from "@/components/PromptForm";
import { SlidePreview } from "@/components/SlidePreview";
import { DownloadButton } from "@/components/DownloadButton";
import type { SlideContent } from "@/types/slide";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [caseImages, setCaseImages] = useState<File[]>([]);
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("ES");
  const [slideData, setSlideData] = useState<SlideContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canGenerate = useMemo(() => {
    return files.length >= 3 && files.length <= 5 && prompt.trim().length > 10;
  }, [files.length, prompt]);

  const handleGenerate = async () => {
    setError(null);
    setSuccess(null);
    setSlideData(null);

    if (!canGenerate) {
      setError("Necesitas entre 3 y 5 ejemplos y un briefing minimo de 10 caracteres.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      for (const file of files) {
        formData.append("examples", file);
      }
      for (const image of caseImages) {
        formData.append("caseImages", image);
      }
      formData.append("prompt", prompt);
      formData.append("language", language);
      formData.append("output", "json");

      const response = await fetch("/api/generate-slide", {
        method: "POST",
        body: formData,
      });

      const body = (await response.json()) as { data?: SlideContent; error?: string };

      if (!response.ok || !body.data) {
        throw new Error(body.error || "No se pudo generar el contenido");
      }

      setSlideData(body.data);
      setSuccess("Contenido generado. Revisa la vista previa y descarga el PPTX.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado al generar");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!slideData) {
      setError("Primero debes generar el contenido de la slide.");
      return;
    }

    try {
      setDownloading(true);
      setError(null);

      const formData = new FormData();
      formData.append("prompt", prompt || "Caso de exito");
      formData.append("language", language);
      formData.append("output", "pptx");
      formData.append("slideData", JSON.stringify(slideData));
      for (const image of caseImages) {
        formData.append("caseImages", image);
      }

      const response = await fetch("/api/generate-slide", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error || "No se pudo generar el PPTX");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "caso-de-exito.pptx";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado al descargar PPTX");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-sky-50 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-700">
            MVP | Generador de casos de exito
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Genera una slide corporativa editable en PowerPoint
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Layout fijo 16:9, narrativa estructurada y exportacion directa a .pptx.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <ExampleUploader files={files} onChange={setFiles} />
          <PromptForm
            prompt={prompt}
            language={language}
            disabled={loading}
            onPromptChange={setPrompt}
            onLanguageChange={setLanguage}
            onSubmit={handleGenerate}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <CaseImageUploader files={caseImages} onChange={setCaseImages} />
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Uso en la slide</h2>
            <p className="mt-1 text-sm text-slate-600">
              Si subes imagenes, el panel derecho del PPTX usara esas imagenes reales. Si no, se mantienen placeholders editables.
            </p>
            <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
              Maximo 3 imagenes. Formatos recomendados: JPG, PNG o WebP.
            </div>
          </section>
        </div>

        {loading && (
          <p className="rounded-lg border border-sky-200 bg-sky-100 px-4 py-3 text-sm text-sky-800">
            Generando contenido estructurado...
          </p>
        )}

        {error && (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </p>
        )}

        {slideData && (
          <div className="space-y-4">
            <SlidePreview data={slideData} caseImages={caseImages} />
            <DownloadButton onClick={handleDownload} disabled={loading} isLoading={downloading} />
          </div>
        )}
      </div>
    </main>
  );
}
