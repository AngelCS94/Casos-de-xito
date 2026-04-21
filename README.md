# Casos-de-xito

MVP en Next.js para generar una única slide de PowerPoint de caso de éxito con layout corporativo fijo.

## Requisitos

- Node.js 20+
- npm 10+

## Variables de entorno

Crea `.env.local`:

```bash
OPENAI_API_KEY=tu_api_key
OPENAI_MODEL=gpt-4.1-mini
```

> Si no defines `OPENAI_API_KEY`, la app usa un contenido mock para poder probar el flujo completo.

## Ejecutar en local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Flujo MVP

1. Subir entre 3 y 5 ejemplos (imágenes/PDF)
2. Escribir briefing
3. Generar contenido estructurado (preview)
4. Descargar PPTX editable
