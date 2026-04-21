import { NextResponse } from "next/server";
import { buildSlidePptx } from "@/lib/pptx";
import { generateSlideContent } from "@/lib/openai";
import { formatValidationError, validateSlidePayload } from "@/lib/validation";

export const runtime = "nodejs";

type FileMeta = { name: string; type: string; size: number };

function parseExamples(formData: FormData): FileMeta[] {
  return formData
    .getAll("examples")
    .filter((entry): entry is File => entry instanceof File)
    .map((file) => ({ name: file.name, type: file.type, size: file.size }));
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const mode = (formData.get("mode") as string | null) ?? "preview";

    if (mode === "download") {
      const rawSlide = formData.get("slideData");
      if (!rawSlide || typeof rawSlide !== "string") {
        return NextResponse.json({ error: "slideData es obligatorio para descargar" }, { status: 400 });
      }

      const validated = validateSlidePayload(JSON.parse(rawSlide));
      const buffer = await buildSlidePptx(validated);
      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "Content-Disposition": `attachment; filename="caso-exito-${Date.now()}.pptx"`,
        },
      });
    }

    const prompt = (formData.get("prompt") as string | null)?.trim() ?? "";
    const language = (formData.get("language") as string | null)?.trim() || "es";
    const examples = parseExamples(formData);

    if (!prompt) {
      return NextResponse.json({ error: "El prompt es obligatorio" }, { status: 400 });
    }

    if (examples.length < 3 || examples.length > 5) {
      return NextResponse.json({ error: "Debes subir entre 3 y 5 ejemplos" }, { status: 400 });
    }

    const slideData = await generateSlideContent({
      briefing: prompt,
      language,
      exampleFiles: examples,
      mode: "preview",
    });

    return NextResponse.json({ slideData });
  } catch (error) {
    const message = formatValidationError(error);
    return NextResponse.json(
      {
        error: "No se pudo generar la slide",
        detail: message,
      },
      { status: 500 },
    );
  }
}
