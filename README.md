# MVP Generador de Slide de Caso de Exito

Aplicacion web con Next.js para generar automaticamente una sola slide corporativa de caso de exito en formato `.pptx`.

## Stack

- Next.js (App Router)
- TypeScript estricto
- Tailwind CSS
- OpenAI API (salida JSON estructurada)
- Zod (validacion de schema)
- PptxGenJS (exportacion editable a PowerPoint)

## Flujo MVP (Fase 1)

1. Subir entre 3 y 5 ejemplos (imagenes o PDF)
2. Subir opcionalmente hasta 3 imagenes finales del caso
3. Escribir briefing/prompt
4. Generar contenido estructurado JSON
5. Previsualizar estructura
6. Descargar `.pptx` con layout fijo corporativo

## Configuracion

1. Instalar dependencias:

```bash
npm install
```

2. Crear `.env.local`:

```bash
OPENAI_API_KEY=tu_api_key
# Opcional
OPENAI_MODEL=gpt-4.1-mini
```

Si `OPENAI_API_KEY` no esta definida, la API devuelve contenido mock valido para poder probar el flujo completo.

## Soporte de imagenes del caso

- Puedes adjuntar hasta 3 imagenes reales del caso.
- Esas imagenes se insertan en el panel derecho del PPTX.
- Si no adjuntas ninguna, el sistema usa placeholders editables.

3. Ejecutar en local:

```bash
npm run dev
```

Abrir `http://localhost:3000`.

## Estructura

```text
/app
	/api/generate-slide/route.ts
	/page.tsx
/components
	ExampleUploader.tsx
	PromptForm.tsx
	SlidePreview.tsx
	DownloadButton.tsx
/lib
	openai.ts
	schema.ts
	pptx.ts
	prompt-builder.ts
	validation.ts
/types
	slide.ts
```
