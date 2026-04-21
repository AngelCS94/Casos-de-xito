import { NextResponse } from "next/server";
import { buildSlidePrompt } from "@/lib/prompt-builder";
import { slideJsonSchema } from "@/lib/schema";
import { buildSingleCaseSlidePptx } from "@/lib/pptx";
import { validateSlideContent } from "@/lib/validation";
import { getOpenAIClient } from "@/lib/openai";
import type { EmbeddedImage, ExampleMeta, GenerateOutputMode, SlideContent } from "@/types/slide";

export const runtime = "nodejs";

async function toEmbeddedImages(files: File[]): Promise<EmbeddedImage[]> {
  const images: EmbeddedImage[] = [];

  for (const file of files.slice(0, 3)) {
    if (!file.type.startsWith("image/")) {
      continue;
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    images.push({
      fileName: file.name,
      dataUrl: `data:${file.type};base64,${bytes.toString("base64")}`,
    });
  }

  return images;
}

function mockSlideFromPrompt(prompt: string): SlideContent {
  const cleanPrompt = prompt.trim() || "Caso de exito corporativo";

  return {
    header: "06. VML THE COCKTAIL | Credenciales de la compania",
    title: `Impulsamos ${cleanPrompt} con una estrategia integrada de negocio, experiencia y activacion comercial`,
    challenge: {
      title: "El Reto",
      body: "El cliente necesitaba transformar una situacion de alta complejidad comercial en una oportunidad de crecimiento sostenido. Existian objetivos de negocio ambiciosos, multiples interlocutores internos y una necesidad clara de alinear mensaje, propuesta de valor y ejecucion en canales clave sin perder foco en resultados medibles.",
    },
    approach: {
      title: "¿Qué hemos hecho?",
      intro: "Disenamos una hoja de ruta pragmatica, coordinando equipos de estrategia, contenido y activacion para ejecutar con velocidad y consistencia.",
      bullets: [
        "Diagnostico del contexto competitivo y prioridades de negocio.",
        "Definicion de narrativa comercial y mensajes por audiencia.",
        "Plan de activacion por fases con gobernanza y ownership claros.",
        "Implementacion coordinada de iniciativas de alto impacto.",
      ],
    },
    impact: {
      title: "Impacto",
      bullets_left: [
        "Mayor claridad estrategica para la toma de decisiones.",
        "Mejora de la coherencia del mensaje en puntos de contacto.",
        "Ejecucion mas agil entre equipos y partners.",
      ],
      bullets_right: [
        "Percepcion de valor reforzada frente a stakeholders clave.",
        "Base solida para escalar nuevas iniciativas comerciales.",
      ],
    },
    visual_panel: {
      style: "collage",
      visual_summary: "Combinacion de capturas de campana, piezas creativas y evidencias de implementacion por canal.",
      asset_suggestions: [
        "Screenshot de landing o ecosistema digital",
        "Pieza creativa principal de campana",
        "Vista de dashboard o resultados cualitativos",
      ],
    },
    logos: [],
  };
}

async function generateSlideContent(args: {
  prompt: string;
  language: string;
  examples: ExampleMeta[];
  imageInputs: Array<{ dataUrl: string; fileName: string }>;
}): Promise<SlideContent> {
  const client = getOpenAIClient();

  if (!client) {
    return mockSlideFromPrompt(args.prompt);
  }

  const { systemPrompt, userPrompt } = buildSlidePrompt({
    userPrompt: args.prompt,
    language: args.language,
    examples: args.examples,
  });

  const userContent: Array<
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string; detail: "low" | "high" | "auto" } }
  > = [{ type: "text", text: userPrompt }];

  for (const image of args.imageInputs.slice(0, 5)) {
    userContent.push({
      type: "image_url",
      image_url: { url: image.dataUrl, detail: "low" },
    });
  }

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
    temperature: 0.4,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "corporate_case_slide",
        schema: slideJsonSchema,
        strict: true,
      },
    },
  });

  const raw = completion.choices[0]?.message?.content;

  if (!raw) {
    throw new Error("No se recibio contenido del modelo");
  }

  const parsed = validateSlideContent(JSON.parse(raw));

  if (!parsed.success) {
    throw new Error(`JSON invalido: ${parsed.error.message}`);
  }

  return parsed.data;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const prompt = String(formData.get("prompt") ?? "").trim();
    const language = String(formData.get("language") ?? "ES").trim() || "ES";
    const output = (String(formData.get("output") ?? "json").trim() || "json") as GenerateOutputMode;
    const slideDataRaw = formData.get("slideData");

    if (!prompt && !slideDataRaw) {
      return NextResponse.json({ error: "El prompt es obligatorio" }, { status: 400 });
    }

    const files = formData
      .getAll("examples")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);
    const caseImageFiles = formData
      .getAll("caseImages")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (caseImageFiles.length > 3) {
      return NextResponse.json({ error: "Solo se permiten hasta 3 imagenes del caso" }, { status: 400 });
    }

    if (!slideDataRaw && (files.length < 3 || files.length > 5)) {
      return NextResponse.json(
        { error: "Debes subir entre 3 y 5 ejemplos" },
        { status: 400 }
      );
    }

    let slideData: SlideContent;

    if (slideDataRaw) {
      const parsedManual = validateSlideContent(JSON.parse(String(slideDataRaw)));

      if (!parsedManual.success) {
        return NextResponse.json(
          { error: "slideData no cumple el schema", details: parsedManual.error.flatten() },
          { status: 400 }
        );
      }

      slideData = parsedManual.data;
    } else {
      const examples: ExampleMeta[] = files.map((file) => ({
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
        fileSize: file.size,
      }));

      const imageInputs = await toEmbeddedImages(files);

      slideData = await generateSlideContent({
        prompt,
        language,
        examples,
        imageInputs,
      });
    }

    if (output === "json") {
      return NextResponse.json({ data: slideData });
    }

    const embeddedCaseImages = await toEmbeddedImages(caseImageFiles);
    const pptxBuffer = await buildSingleCaseSlidePptx(slideData, embeddedCaseImages);

    return new NextResponse(new Uint8Array(pptxBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": 'attachment; filename="caso-de-exito.pptx"',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
