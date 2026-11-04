# IA en el client-side: el costo oculto en tu INP

Demos de la charla **"IA en el client-side: el costo oculto en tu INP (y cómo evitarlo)"**,
presentada en **JSConf México** (Guadalajara, 29 y 30 de octubre de 2026).

Por **Leslie Herrera** · [linkedin.com/in/dereemii](https://linkedin.com/in/dereemii) · @dereemii

🇬🇧 [Read in English](README.md)

**Sitio:** https://dereemii.github.io/ia-client-side-inp/

## Qué hay aquí

| Demo | Carpeta | Qué muestra |
|------|---------|-------------|
| **Demo 01 · INP en tiempo real** | [`demo-1-inp/`](demo-1-inp/) | El mismo trabajo pesado ejecutado de tres formas: **main thread**, **chunking** (ceder el turno al navegador entre partes) y **Web Worker**. Mide la latencia de las interacciones (clicks y teclas) con la Event Timing API, y muestra un punto animado y los FPS: si el punto se congela, el hilo principal estuvo ocupado. |
| **Demo 02 · Un LLM real en el navegador** | [`demo-2-llm/`](demo-2-llm/) | `distilgpt2` (Hugging Face, vía Transformers.js) generando texto en tres modos: **main thread**, **Worker + WASM** y **Worker + WebGPU**. |

La idea de la charla: la diferencia no es *cuánto* cálculo hay, sino *dónde* corre.

## Cómo correrlas

Las demos son HTML estático, sin build. Pero el Worker de la demo 2 es un módulo ES,
así que **no abre con `file://`**: necesita servirse por HTTP.

```bash
git clone https://github.com/dereemii/ia-client-side-inp.git
cd ia-client-side-inp
python3 -m http.server 8000
# abre http://localhost:8000
```

(Cualquier servidor estático sirve: `npx serve`, la extensión Live Server de VS Code, etc.)

### GitHub Pages

Si publicas el repo con GitHub Pages (Settings → Pages → *Deploy from a branch* → `main` / root),
las demos quedan en `https://<usuario>.github.io/<repo>/`, ya con HTTPS.

## Requisitos

- **Navegador de escritorio reciente.** Chrome o Edge para probar **WebGPU**. Si tu navegador no
  lo soporta, usa el modo *Worker + WASM*: funciona sin GPU.
- **Conexión a internet** la primera vez en la demo 2: la librería se carga desde jsDelivr y el
  modelo desde Hugging Face. Después queda en caché del navegador.
- Usa el botón **"Preparar modelos"** de la demo 2 para precargarlos antes de comparar modos.

## Cosas que vale la pena saber

- Con un modelo chico como `distilgpt2`, **WebGPU no siempre gana**: el costo fijo de hablar con la
  GPU (compilar shaders, copiar datos CPU↔GPU, lanzar cada operación por cada token) puede comerse la
  ganancia. Conviene más con modelos grandes.
- Mover la inferencia a un Worker **no la hace más rápida**: la saca del hilo principal para que la
  interfaz siga respondiendo. Esa es la diferencia que mide el INP.
- En la demo 1 solo se cuentan clicks y teclas, que son las interacciones que cuentan para el INP;
  el hover y el scroll no.

## Estructura

```
.
├── index.html                  # portada: demos, charla y "Quién soy" (tema claro y oscuro)
├── assets/                     # ilustraciones de la portada
├── charla/                     # PDF de la presentación (ia-client-side-inp.pdf)
├── demo-1-inp/index.html       # demo 01 (archivo único)
└── demo-2-llm/
    ├── index.html              # demo 02
    └── transformers-worker.js  # Worker real; debe estar junto al index.html
```

## Créditos

- [Transformers.js](https://github.com/huggingface/transformers.js) (Hugging Face)
- Modelo [`Xenova/distilgpt2`](https://huggingface.co/Xenova/distilgpt2)
- Tipografías: IBM Plex Sans y JetBrains Mono (Google Fonts)

## Licencia

El código se publica bajo la [licencia MIT](LICENSE).

Las ilustraciones de `assets/` son obra personal de la autora y **no** están cubiertas por la licencia MIT; pide permiso antes de reutilizarlas.

## Presentación y idioma

- La portada enlaza al PDF de la charla en `charla/ia-client-side-inp.pdf` (botón del hero y enlace "Charla" del menú). 
- La portada está en español e inglés. El botón ES/EN de la barra cambia el idioma y lo recuerda en el navegador; la primera vez usa el idioma del navegador. Los textos viven en el diccionario `I18N` al final de `index.html`.
