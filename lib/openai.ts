import OpenAI from "openai";
import { buildInternalPrompt } from "@/lib/prompt-builder";
import { slideSchema, type SlideSchema } from "@/lib/schema";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

function getClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function buildMockSlide(briefing: string): SlideSchema {
  return slideSchema.parse({
    header: "06. VML THE COCKTAIL | Caso de éxito",
    title: "Impulsamos una estrategia integral para acelerar resultados comerciales del cliente",
    challenge: {
      title: "El Reto",
      body: `El cliente necesitaba evolucionar su posicionamiento y activar una propuesta comercial más consistente entre equipos, con foco en mejorar la conversión de oportunidades y la calidad del pipeline. El contexto exigía rapidez de ejecución, coordinación transversal y mensajes claros para el negocio. Brief base: ${briefing.slice(0, 120)}`,
    },
    approach: {
      title: "¿Qué hemos hecho?",
      intro: "Diseñamos un plan pragmático orientado a resultados con entregables accionables desde la primera fase.",
      bullets: [
        "Diagnóstico de situación y priorización de palancas críticas",
        "Definición de narrativa comercial y propuesta de valor por segmento",
        "Plan operativo con quick wins y hoja de ruta escalable",
      ],
    },
    impact: {
      title: "Impacto",
      bullets_left: [
        "Mayor claridad estratégica para la toma de decisiones",
        "Mejor alineación entre equipos comerciales y de marketing",
        "Incremento de la tracción comercial en cuentas prioritarias",
      ],
      bullets_right: [],
    },
    visual_panel: {
      style: "collage",
      visual_summary: "Collage con dashboard de resultados, workshop con cliente y activos de campaña.",
      asset_suggestions: [
        "Captura de dashboard comercial",
        "Foto de sesión de trabajo con cliente",
        "Mockup de pieza de comunicación",
      ],
    },
    logos: [],
  });
}

export async function generateSlideContent(input: {
  briefing: string;
  language: string;
  exampleFiles: Array<{ name: string; type: string; size: number }>;
  mode: "preview" | "download";
}): Promise<SlideSchema> {
  const client = getClient();

  if (!client) {
    return buildMockSlide(input.briefing);
  }

  const prompt = buildInternalPrompt(input);
  const response = await client.responses.create({
    model: MODEL,
    input: prompt,
    temperature: 0.4,
    text: {
      format: {
        type: "json_schema",
        name: "corporate_success_slide",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            header: { type: "string" },
            title: { type: "string" },
            challenge: {
              type: "object",
              additionalProperties: false,
              properties: {
                title: { type: "string", enum: ["El Reto"] },
                body: { type: "string" },
              },
              required: ["title", "body"],
            },
            approach: {
              type: "object",
              additionalProperties: false,
              properties: {
                title: { type: "string", enum: ["¿Qué hemos hecho?"] },
                intro: { type: "string" },
                bullets: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 5 },
              },
              required: ["title", "intro", "bullets"],
            },
            impact: {
              type: "object",
              additionalProperties: false,
              properties: {
                title: { type: "string", enum: ["Impacto"] },
                bullets_left: { type: "array", items: { type: "string" } },
                bullets_right: { type: "array", items: { type: "string" } },
              },
              required: ["title", "bullets_left", "bullets_right"],
            },
            visual_panel: {
              type: "object",
              additionalProperties: false,
              properties: {
                style: { type: "string", enum: ["collage"] },
                visual_summary: { type: "string" },
                asset_suggestions: {
                  type: "array",
                  items: { type: "string" },
                  minItems: 3,
                  maxItems: 3,
                },
              },
              required: ["style", "visual_summary", "asset_suggestions"],
            },
            logos: { type: "array", items: { type: "string" } },
          },
          required: ["header", "title", "challenge", "approach", "impact", "visual_panel", "logos"],
        },
      },
    },
  });

  const raw = response.output_text;
  const parsed = JSON.parse(raw) as unknown;
  return slideSchema.parse(parsed);
}
