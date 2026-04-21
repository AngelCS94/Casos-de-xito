import PptxGenJS from "pptxgenjs";
import type { SlideSchema } from "@/lib/schema";

function withBullets(values: string[]): string {
  return values.map((value) => `• ${value}`).join("\n");
}

export async function buildSlidePptx(slideData: SlideSchema): Promise<Buffer> {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Casos de Éxito MVP";
  pptx.subject = "Caso de éxito corporativo";
  pptx.title = slideData.title;
  pptx.company = "VML The Cocktail";

  const slide = pptx.addSlide();

  slide.background = { color: "FFFFFF" };
  slide.addShape(pptx.ShapeType.rect, {
    x: 8,
    y: 0,
    w: 5.333,
    h: 7.5,
    fill: { color: "E8F1FF" },
    line: { color: "E8F1FF" },
  });

  const blue = "1F5AA8";
  slide.addText(slideData.header, {
    x: 0.6,
    y: 0.4,
    w: 6.8,
    h: 0.3,
    fontSize: 10,
    color: "4B5563",
    bold: true,
  });

  slide.addText(slideData.title, {
    x: 0.6,
    y: 0.85,
    w: 7.1,
    h: 1.1,
    fontSize: 23,
    bold: true,
    color: "111827",
    valign: "top",
  });

  slide.addText(slideData.challenge.title, {
    x: 0.6,
    y: 2.1,
    w: 3.2,
    h: 0.3,
    fontSize: 13,
    color: blue,
    bold: true,
  });

  slide.addText(slideData.challenge.body, {
    x: 0.6,
    y: 2.45,
    w: 7.0,
    h: 1.2,
    fontSize: 12,
    color: "1F2937",
    valign: "top",
    fit: "shrink",
  });

  slide.addText(slideData.approach.title, {
    x: 0.6,
    y: 3.75,
    w: 3.8,
    h: 0.3,
    fontSize: 13,
    color: blue,
    bold: true,
  });

  slide.addText(slideData.approach.intro, {
    x: 0.6,
    y: 4.1,
    w: 7.0,
    h: 0.65,
    fontSize: 11,
    color: "1F2937",
    fit: "shrink",
  });

  slide.addText(withBullets(slideData.approach.bullets), {
    x: 0.6,
    y: 4.75,
    w: 7.0,
    h: 1.2,
    fontSize: 11,
    color: "1F2937",
    valign: "top",
    fit: "shrink",
  });

  slide.addText(slideData.impact.title, {
    x: 0.6,
    y: 6.0,
    w: 3.0,
    h: 0.3,
    fontSize: 13,
    color: blue,
    bold: true,
  });

  slide.addText(withBullets(slideData.impact.bullets_left), {
    x: 0.6,
    y: 6.3,
    w: slideData.impact.bullets_right.length ? 3.2 : 7.0,
    h: 1.0,
    fontSize: 10,
    color: "1F2937",
    fit: "shrink",
  });

  if (slideData.impact.bullets_right.length > 0) {
    slide.addText(withBullets(slideData.impact.bullets_right), {
      x: 3.95,
      y: 6.3,
      w: 3.65,
      h: 1.0,
      fontSize: 10,
      color: "1F2937",
      fit: "shrink",
    });
  }

  slide.addText("Panel visual (collage)", {
    x: 8.2,
    y: 0.45,
    w: 4.9,
    h: 0.35,
    fontSize: 12,
    bold: true,
    color: blue,
  });

  slide.addText(slideData.visual_panel.visual_summary, {
    x: 8.2,
    y: 0.8,
    w: 4.8,
    h: 0.7,
    fontSize: 9,
    color: "374151",
    fit: "shrink",
  });

  const placeholders = [
    { x: 8.25, y: 1.6, w: 2.35, h: 2.2 },
    { x: 10.75, y: 1.6, w: 2.35, h: 1.2 },
    { x: 10.75, y: 2.95, w: 2.35, h: 2.55 },
  ];

  placeholders.forEach((box, index) => {
    slide.addShape(pptx.ShapeType.roundRect, {
      ...box,
      fill: { color: "D6E7FF" },
      line: { color: "9FC3F5", pt: 1 },
    });

    slide.addText(slideData.visual_panel.asset_suggestions[index] || `Asset ${index + 1}`, {
      x: box.x + 0.1,
      y: box.y + box.h / 2 - 0.2,
      w: box.w - 0.2,
      h: 0.4,
      fontSize: 9,
      color: "1E3A5F",
      align: "center",
      valign: "middle",
      fit: "shrink",
    });
  });

  if (slideData.logos.length > 0) {
    slide.addText(`Logos sugeridos: ${slideData.logos.join(" | ")}`, {
      x: 8.2,
      y: 6.5,
      w: 4.9,
      h: 0.5,
      fontSize: 8,
      color: "4B5563",
      fit: "shrink",
    });
  }

  return (await pptx.write({ outputType: "nodebuffer" })) as Buffer;
}
