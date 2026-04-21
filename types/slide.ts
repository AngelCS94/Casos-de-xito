export type SlideContent = {
  header: string;
  title: string;
  challenge: {
    title: "El Reto";
    body: string;
  };
  approach: {
    title: "¿Qué hemos hecho?";
    intro: string;
    bullets: string[];
  };
  impact: {
    title: "Impacto";
    bullets_left: string[];
    bullets_right: string[];
  };
  visual_panel: {
    style: "collage";
    visual_summary: string;
    asset_suggestions: string[];
  };
  logos: string[];
};

export type GenerateMode = "preview" | "download";
