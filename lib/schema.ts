import { z } from "zod";

const shortText = z.string().trim().min(1).max(220);
const paragraph = z.string().trim().min(45).max(800);
const shortParagraph = z.string().trim().min(20).max(280);
const executiveBullet = z.string().trim().min(4).max(140);

export const slideSchema = z.object({
  header: shortText,
  title: z.string().trim().min(20).max(220),
  challenge: z.object({
    title: z.literal("El Reto"),
    body: paragraph,
  }),
  approach: z.object({
    title: z.literal("¿Qué hemos hecho?"),
    intro: shortParagraph,
    bullets: z.array(executiveBullet).min(3).max(5),
  }),
  impact: z.object({
    title: z.literal("Impacto"),
    bullets_left: z.array(executiveBullet).min(1).max(3),
    bullets_right: z.array(executiveBullet).max(3),
  }),
  visual_panel: z.object({
    style: z.literal("collage"),
    visual_summary: z.string().trim().min(12).max(200),
    asset_suggestions: z.array(shortText).length(3),
  }),
  logos: z.array(shortText).max(3),
});

export type SlideSchema = z.infer<typeof slideSchema>;

export const slideJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "header",
    "title",
    "challenge",
    "approach",
    "impact",
    "visual_panel",
    "logos",
  ],
  properties: {
    header: { type: "string" },
    title: { type: "string" },
    challenge: {
      type: "object",
      additionalProperties: false,
      required: ["title", "body"],
      properties: {
        title: { type: "string", const: "El Reto" },
        body: { type: "string" },
      },
    },
    approach: {
      type: "object",
      additionalProperties: false,
      required: ["title", "intro", "bullets"],
      properties: {
        title: { type: "string", const: "¿Qué hemos hecho?" },
        intro: { type: "string" },
        bullets: {
          type: "array",
          minItems: 3,
          maxItems: 5,
          items: { type: "string" },
        },
      },
    },
    impact: {
      type: "object",
      additionalProperties: false,
      required: ["title", "bullets_left", "bullets_right"],
      properties: {
        title: { type: "string", const: "Impacto" },
        bullets_left: {
          type: "array",
          minItems: 1,
          maxItems: 3,
          items: { type: "string" },
        },
        bullets_right: {
          type: "array",
          maxItems: 3,
          items: { type: "string" },
        },
      },
    },
    visual_panel: {
      type: "object",
      additionalProperties: false,
      required: ["style", "visual_summary", "asset_suggestions"],
      properties: {
        style: { type: "string", const: "collage" },
        visual_summary: { type: "string" },
        asset_suggestions: {
          type: "array",
          minItems: 3,
          maxItems: 3,
          items: { type: "string" },
        },
      },
    },
    logos: {
      type: "array",
      maxItems: 3,
      items: { type: "string" },
    },
  },
} as const;
