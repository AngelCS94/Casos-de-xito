"use client";

interface ExampleUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export function ExampleUploader({ files, onChange }: ExampleUploaderProps) {
  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files ?? []);
    onChange(nextFiles);
  };

  const tooMany = files.length > 5;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Ejemplos de referencia</h2>
      <p className="mt-1 text-sm text-slate-600">
        Sube entre 1 y 5 slides ejemplo (imagen o PDF).
      </p>
      <input
        className="mt-4 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-sky-100 file:px-3 file:py-2 file:text-sky-800"
        type="file"
        multiple
        accept="image/*,.pdf"
        onChange={handleFiles}
      />
      <div className="mt-3 text-xs text-slate-500">
        Seleccionados: <strong>{files.length}</strong>
      </div>
      {tooMany && <p className="mt-2 text-sm text-rose-600">Debes seleccionar entre 1 y 5 archivos.</p>}
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
