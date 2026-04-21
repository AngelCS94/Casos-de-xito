import type { GenerateMode } from "@/types/slide";

type BuildPromptInput = {
  briefing: string;
  language: string;
  exampleFiles: Array<{ name: string; type: string; size: number }>;
  mode: GenerateMode;
};

export function buildInternalPrompt({
  briefing,
  language,
  exampleFiles,
  mode,
}: BuildPromptInput): string {
  const serializedExamples = exampleFiles
    .map(
      (file, index) =>
        `${index + 1}. ${file.name} (${file.type || "tipo_desconocido"}, ${Math.round(file.size / 1024)}KB)`,
    )
    .join("\n");

  return `Eres un redactor senior de consultoría comercial B2B. Tu misión es generar contenido para UNA sola slide corporativa de caso de éxito en formato credenciales/propuesta.

OBJETIVO EDITORIAL:
- Inspirarte en la lógica narrativa de los ejemplos aportados (estructura, tono, orden de ideas).
- NO copiar frases literales ni claims exactos de los ejemplos.
- NO inventar métricas numéricas ni porcentajes si no están explícitamente en el briefing.
- Si faltan cifras, redacta impacto cualitativo sólido y ejecutivo.
- El contenido debe ser breve y apto para encajar en una única slide real.

CONTEXTO DE EJEMPLOS SUBIDOS:
${serializedExamples || "No se recibieron metadatos de ejemplos."}

IDIOMA DE SALIDA:
${language}

BRIEFING DEL NUEVO CASO:
${briefing}

RESTRICCIONES DE ESTILO:
- Tono ejecutivo, comercial, claro y profesional.
- Texto conciso y escaneable.
- Evita adornos creativos.
- Piensa en una slide corporativa con jerarquía tipográfica clara.

REQUISITOS DE CAMPOS:
- header corto estilo sección corporativa.
- title potente, claro y comercial.
- challenge.body entre 45 y 80 palabras.
- approach.intro breve.
- approach.bullets entre 3 y 5 bullets ejecutivos.
- impact en bullets cortos. bullets_right puede ir vacío si no aporta.
- visual_panel solo describe visuales sugeridos (NO generar imágenes).
- logos: array opcional (vacío si no aplica).

IMPORTANTE DE FORMATO:
- Responde EXCLUSIVAMENTE en JSON válido.
- Sin markdown, sin bloques de código, sin texto adicional.
- Debes respetar exactamente las claves esperadas por el schema.

MODO SOLICITADO:
${mode}`;
}
