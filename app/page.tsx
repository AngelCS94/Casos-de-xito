"use client";

import { useMemo, useState } from "react";
import { DownloadButton } from "@/components/DownloadButton";
import { ExampleUploader } from "@/components/ExampleUploader";
import { PromptForm } from "@/components/PromptForm";
import { SlidePreview } from "@/components/SlidePreview";
import type { SlideSchema } from "@/lib/schema";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("es");
  const [slideData, setSlideData] = useState<SlideSchema | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = useMemo(
    () => files.length >= 3 && files.length <= 5 && prompt.trim().length > 20,
    [files.length, prompt],
  );

  const handleGenerate = async () => {
    if (!canGenerate) {
      setError("Sube entre 3 y 5 ejemplos y escribe un briefing más detallado.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("examples", file));
      formData.append("prompt", prompt);
      formData.append("language", language);
      formData.append("mode", "preview");

      const response = await fetch("/api/generate-slide", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as { slideData?: SlideSchema; error?: string; detail?: string };
      if (!response.ok || !payload.slideData) {
        throw new Error(payload.detail || payload.error || "Error desconocido");
      }

      setSlideData(payload.slideData);
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!slideData) {
      return;
    }

    setDownloading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("mode", "download");
      formData.append("slideData", JSON.stringify(slideData));

      const response = await fetch("/api/generate-slide", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string; detail?: string };
        throw new Error(payload.detail || payload.error || "No se pudo generar el archivo");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "caso-exito.pptx";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : "Error en descarga");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <header>
          <h1 className="text-2xl font-bold text-slate-900">Generador de slide de caso de éxito (MVP)</h1>
          <p className="mt-1 text-sm text-slate-600">
            Sube entre 3 y 5 ejemplos, redacta un briefing y genera una slide corporativa editable en PPTX.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-1">
            <div className="space-y-4">
              <ExampleUploader files={files} onChange={setFiles} />
              <PromptForm
                prompt={prompt}
                language={language}
                loading={loading}
                onPromptChange={setPrompt}
                onLanguageChange={setLanguage}
                onGenerate={handleGenerate}
              />
              <DownloadButton disabled={!slideData} loading={downloading} onDownload={handleDownload} />
              {error && <p className="rounded-md bg-red-50 p-2 text-xs text-red-700">{error}</p>}
            </div>
          </div>

          <div className="lg:col-span-2">
            <SlidePreview slide={slideData} />
          </div>
        </section>
      </main>
    </div>
  );
}
