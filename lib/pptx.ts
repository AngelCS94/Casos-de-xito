import PptxGenJS from "pptxgenjs";
import type { EmbeddedImage, SlideContent } from "@/types/slide";

const COLORS = {
  white: "FFFFFF",
  text: "1F2A37",
  muted: "4B5563",
  blueTitle: "1D4ED8",
  panelBlue: "DDEBFF",
  panelBorder: "AFC8F3",
  placeholderFill: "EFF6FF",
  placeholderText: "1E3A8A",
};

function toBulletRuns(items: string[]) {
  return items.map((item) => ({
    text: item,
    options: { bullet: { indent: 14 }, hanging: 2 },
  }));
}

function addVisualImages(
  pptx: PptxGenJS,
  slide: PptxGenJS.Slide,
  leftW: number,
  rightW: number,
  images: EmbeddedImage[]
) {
  const placements =
    images.length === 1
      ? [{ x: leftW + 0.42, y: 1.55, w: rightW - 0.84, h: 4.95 }]
      : images.length === 2
        ? [
            { x: leftW + 0.42, y: 1.55, w: rightW - 0.84, h: 2.35 },
            { x: leftW + 0.42, y: 4.05, w: rightW - 0.84, h: 2.45 },
          ]
        : [
            { x: leftW + 0.42, y: 1.55, w: rightW * 0.53, h: 4.95 },
            { x: leftW + rightW * 0.58, y: 1.55, w: rightW * 0.34, h: 2.35 },
            { x: leftW + rightW * 0.58, y: 4.15, w: rightW * 0.34, h: 2.35 },
          ];

  images.slice(0, 3).forEach((image, index) => {
    const placement = placements[index];

    slide.addImage({
      data: image.dataUrl,
      x: placement.x,
      y: placement.y,
      w: placement.w,
      h: placement.h,
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: placement.x,
      y: placement.y,
      w: placement.w,
      h: placement.h,
      rectRadius: 0.04,
      fill: { color: COLORS.placeholderFill, transparency: 100 },
      line: { color: COLORS.panelBorder, pt: 1 },
    });
  });
}

export async function buildSingleCaseSlidePptx(
  data: SlideContent,
  caseImages: EmbeddedImage[] = []
): Promise<Buffer> {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Case Slide MVP";
  pptx.company = "Caso de Exito Generator";
  pptx.subject = "Corporate Case Study";
  pptx.title = data.title;

  const slide = pptx.addSlide();

  const totalW = 13.333;
  const totalH = 7.5;
  const leftW = totalW * 0.6;
  const rightW = totalW - leftW;

  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: leftW,
    h: totalH,
    fill: { color: COLORS.white },
    line: { color: COLORS.white, pt: 0 },
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: leftW,
    y: 0,
    w: rightW,
    h: totalH,
    fill: { color: COLORS.panelBlue },
    line: { color: COLORS.panelBorder, pt: 1 },
  });

  slide.addText(data.header, {
    x: 0.55,
    y: 0.35,
    w: leftW - 1,
    h: 0.3,
    fontFace: "Calibri",
    fontSize: 10,
    color: COLORS.muted,
    bold: false,
  });

  slide.addText(data.title, {
    x: 0.55,
    y: 0.72,
    w: leftW - 0.95,
    h: 0.95,
    fontFace: "Calibri",
    fontSize: 22,
    color: COLORS.text,
    bold: true,
    valign: "top",
    fit: "shrink",
  });

  const bodyW = leftW - 1.1;

  slide.addText(data.challenge.title, {
    x: 0.55,
    y: 1.95,
    w: bodyW,
    h: 0.25,
    fontFace: "Calibri",
    fontSize: 13,
    bold: true,
    color: COLORS.blueTitle,
  });

  slide.addText(data.challenge.body, {
    x: 0.55,
    y: 2.2,
    w: bodyW,
    h: 1.1,
    fontFace: "Calibri",
    fontSize: 12,
    color: COLORS.text,
    valign: "top",
    fit: "shrink",
  });

  slide.addText(data.approach.title, {
    x: 0.55,
    y: 3.45,
    w: bodyW,
    h: 0.25,
    fontFace: "Calibri",
    fontSize: 13,
    bold: true,
    color: COLORS.blueTitle,
  });

  slide.addText(data.approach.intro, {
    x: 0.55,
    y: 3.72,
    w: bodyW,
    h: 0.55,
    fontFace: "Calibri",
    fontSize: 11,
    color: COLORS.text,
    fit: "shrink",
  });

  slide.addText(toBulletRuns(data.approach.bullets), {
    x: 0.72,
    y: 4.2,
    w: bodyW - 0.15,
    h: 1.15,
    fontFace: "Calibri",
    fontSize: 10.5,
    color: COLORS.text,
    paraSpaceAfter: 5,
    valign: "top",
    fit: "shrink",
  });

  slide.addText(data.impact.title, {
    x: 0.55,
    y: 5.45,
    w: bodyW,
    h: 0.25,
    fontFace: "Calibri",
    fontSize: 13,
    bold: true,
    color: COLORS.blueTitle,
  });

  const hasRightColumn = data.impact.bullets_right.length > 0;
  const colGap = 0.2;
  const colW = hasRightColumn ? (bodyW - colGap) / 2 : bodyW;

  slide.addText(toBulletRuns(data.impact.bullets_left), {
    x: 0.72,
    y: 5.72,
    w: colW - 0.05,
    h: 1.3,
    fontFace: "Calibri",
    fontSize: 10.5,
    color: COLORS.text,
    paraSpaceAfter: 4,
    fit: "shrink",
  });

  if (hasRightColumn) {
    slide.addText(toBulletRuns(data.impact.bullets_right), {
      x: 0.72 + colW + colGap,
      y: 5.72,
      w: colW - 0.1,
      h: 1.3,
      fontFace: "Calibri",
      fontSize: 10.5,
      color: COLORS.text,
      paraSpaceAfter: 4,
      fit: "shrink",
    });
  }

  slide.addText("Panel visual (collage sugerido)", {
    x: leftW + 0.35,
    y: 0.35,
    w: rightW - 0.7,
    h: 0.35,
    fontFace: "Calibri",
    fontSize: 11,
    bold: true,
    color: COLORS.placeholderText,
  });

  slide.addText(data.visual_panel.visual_summary, {
    x: leftW + 0.35,
    y: 0.72,
    w: rightW - 0.7,
    h: 0.7,
    fontFace: "Calibri",
    fontSize: 9.5,
    color: COLORS.placeholderText,
    fit: "shrink",
  });

  if (caseImages.length > 0) {
    addVisualImages(pptx, slide, leftW, rightW, caseImages);
  } else {
    const placeholders = [
      { x: leftW + 0.45, y: 1.55, w: rightW * 0.48, h: 1.7 },
      { x: leftW + rightW * 0.52, y: 1.55, w: rightW * 0.4, h: 1.15 },
      { x: leftW + rightW * 0.52, y: 2.78, w: rightW * 0.4, h: 1.8 },
      { x: leftW + 0.45, y: 3.4, w: rightW * 0.48, h: 2.1 },
      { x: leftW + 0.45, y: 5.58, w: rightW * 0.47, h: 1.2 },
      { x: leftW + rightW * 0.52, y: 4.7, w: rightW * 0.4, h: 2.08 },
    ];

    placeholders.forEach((item, idx) => {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        rectRadius: 0.04,
        fill: { color: COLORS.placeholderFill, transparency: 0 },
        line: { color: COLORS.panelBorder, pt: 1 },
      });

      const label = data.visual_panel.asset_suggestions[idx % data.visual_panel.asset_suggestions.length];

      slide.addText(label, {
        x: item.x + 0.1,
        y: item.y + 0.1,
        w: item.w - 0.2,
        h: 0.35,
        fontFace: "Calibri",
        fontSize: 8.5,
        color: COLORS.placeholderText,
        fit: "shrink",
        bold: true,
      });
    });
  }

  if (data.logos.length > 0) {
    slide.addText(`Logos sugeridos: ${data.logos.join(" | ")}`, {
      x: leftW + 0.35,
      y: totalH - 0.45,
      w: rightW - 0.7,
      h: 0.25,
      fontFace: "Calibri",
      fontSize: 8,
      color: COLORS.placeholderText,
      italic: true,
    });
  }

  const arrayBuffer = (await pptx.write({ outputType: "arraybuffer" })) as ArrayBuffer;
  return Buffer.from(arrayBuffer);
}
