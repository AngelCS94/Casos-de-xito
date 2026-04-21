import type { ExampleMeta } from "@/types/slide";

interface BuildPromptInput {
  userPrompt: string;
  language: string;
  examples: ExampleMeta[];
}

export function buildSlidePrompt(input: BuildPromptInput) {
  const examplesSummary = input.examples
    .map(
      (file, index) =>
        `${index + 1}. ${file.fileName} | tipo: ${file.fileType} | tamano: ${Math.round(file.fileSize / 1024)}KB`
    )
    .join("\n");

  const systemPrompt = `Eres un consultor senior de marketing/transformacion digital y copywriter B2B.
Generas contenido para UNA sola slide corporativa de caso de exito con layout fijo.
No diseñas layout ni cambias secciones. Solo rellenas campos del JSON.

Reglas obligatorias:
- Sigue una logica editorial de credenciales: contexto -> accion -> impacto.
- Inspira la narrativa en los ejemplos, pero NUNCA copies frases textuales.
- No inventes metricas numericas.
- Si faltan cifras, usa impacto cualitativo, especifico y creible.
- Estilo ejecutivo, comercial y claro.
- Frases cortas que quepan en una slide real.
- Devuelve EXCLUSIVAMENTE JSON valido, sin markdown ni texto extra.
- Mantener estas secciones exactamente: El Reto, ¿Que hemos hecho?, Impacto.
- visual_panel solo describe orientaciones semanticas del collage derecho.
`;

  const userPrompt = `Objetivo: generar contenido para un nuevo caso de exito.
Idioma solicitado: ${input.language}.

Briefing del usuario:
"""
${input.userPrompt.trim()}
"""

Resumen de ejemplos aportados (3 a 5):
${examplesSummary || "No se recibieron metadatos utiles."}

Requisitos de contenido:
- header corto estilo seccion + marca.
- title fuerte y comercial.
- challenge.body entre 45 y 80 palabras.
- approach.intro corto.
- approach.bullets entre 3 y 5 bullets ejecutivos.
- impact en 1 o 2 columnas: bullets_left y bullets_right (puede ir vacio).
- visual_panel.style = collage.
- visual_panel.asset_suggestions con 3 sugerencias concretas.
- logos opcional, maximo 3 elementos.
`;

  return { systemPrompt, userPrompt };
}
