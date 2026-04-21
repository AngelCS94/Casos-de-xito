import { ZodError } from "zod";
import { slideSchema, type SlideSchema } from "@/lib/schema";

export function validateSlidePayload(payload: unknown): SlideSchema {
  return slideSchema.parse(payload);
}

export function formatValidationError(error: unknown): string {
  if (!(error instanceof ZodError)) {
    return "Error de validación desconocido";
  }

  return error.issues
    .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
    .join("; ");
}
