"use client";

type ExampleUploaderProps = {
  files: File[];
  onChange: (files: File[]) => void;
};

export function ExampleUploader({ files, onChange }: ExampleUploaderProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="examples" className="text-sm font-semibold text-slate-700">
        Ejemplos (3 a 5 archivos, imagen o PDF)
      </label>
      <input
        id="examples"
        type="file"
        accept="image/*,application/pdf"
        multiple
        onChange={(event) => onChange(Array.from(event.target.files ?? []))}
        className="block w-full rounded-lg border border-slate-300 bg-white p-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-white"
      />
      <ul className="text-xs text-slate-600">
        {files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
}
