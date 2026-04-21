import type { SlideSchema } from "@/lib/schema";

export type SlideContent = SlideSchema;

export type GenerateOutputMode = "json" | "pptx";

export interface ExampleMeta {
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface EmbeddedImage {
  fileName: string;
  dataUrl: string;
}
