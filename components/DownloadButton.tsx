"use client";

interface DownloadButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function DownloadButton({ onClick, disabled, isLoading }: DownloadButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className="rounded-lg border border-sky-700 bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300"
    >
      {isLoading ? "Generando PPTX..." : "Descargar PPTX"}
    </button>
  );
}
