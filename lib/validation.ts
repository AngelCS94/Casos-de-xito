import { slideSchema } from "@/lib/schema";

export function validateSlideContent(payload: unknown) {
  return slideSchema.safeParse(payload);
}
