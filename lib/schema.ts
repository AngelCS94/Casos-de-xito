import { z } from "zod";

export const slideSchema = z.object({
  header: z.string().min(10).max(120),
  title: z.string().min(20).max(220),
  challenge: z.object({
    title: z.literal("El Reto"),
    body: z.string().min(45).max(700),
  }),
  approach: z.object({
    title: z.literal("¿Qué hemos hecho?"),
    intro: z.string().min(20).max(300),
    bullets: z.array(z.string().min(4).max(140)).min(3).max(5),
  }),
  impact: z.object({
    title: z.literal("Impacto"),
    bullets_left: z.array(z.string().min(4).max(120)).min(1).max(3),
    bullets_right: z.array(z.string().min(4).max(120)).max(3),
  }),
  visual_panel: z.object({
    style: z.literal("collage"),
    visual_summary: z.string().min(10).max(240),
    asset_suggestions: z.array(z.string().min(4).max(80)).min(3).max(3),
  }),
  logos: z.array(z.string().min(1).max(80)).max(3).default([]),
});

export type SlideSchema = z.infer<typeof slideSchema>;
