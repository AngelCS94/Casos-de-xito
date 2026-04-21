"use client";

type DownloadButtonProps = {
  disabled: boolean;
  loading: boolean;
  onDownload: () => void;
};

export function DownloadButton({ disabled, loading, onDownload }: DownloadButtonProps) {
  return (
    <button
      type="button"
      onClick={onDownload}
      disabled={disabled || loading}
      className="rounded-lg border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Preparando descarga..." : "Descargar PPTX"}
    </button>
  );
}
