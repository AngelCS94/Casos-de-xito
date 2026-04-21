"use client";

interface CaseImageUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export function CaseImageUploader({ files, onChange }: CaseImageUploaderProps) {
  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files ?? []).slice(0, 3);
    onChange(nextFiles);
  };

  const tooMany = files.length > 3;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Imagenes del caso</h2>
      <p className="mt-1 text-sm text-slate-600">
        Sube hasta 3 imagenes finales para incluirlas en el panel derecho del PPTX.
      </p>
      <input
        className="mt-4 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-sky-100 file:px-3 file:py-2 file:text-sky-800"
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={handleFiles}
      />
      <div className="mt-3 text-xs text-slate-500">
        Seleccionadas: <strong>{files.length}</strong>
      </div>
      {tooMany && (
        <p className="mt-2 text-sm text-rose-600">Solo se permiten hasta 3 imagenes.</p>
      )}
      {files.length > 0 && (
        <ul className="mt-3 max-h-28 space-y-1 overflow-auto rounded-md bg-slate-50 p-2 text-xs text-slate-700">
          {files.map((file) => (
            <li key={`${file.name}-${file.size}`}>
              {file.name} ({Math.round(file.size / 1024)} KB)
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
