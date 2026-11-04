# AI on the client side: the hidden cost to your INP

Demos for the talk **"IA en el client-side: el costo oculto en tu INP (y cómo evitarlo)"**
("AI on the client side: the hidden cost to your INP, and how to avoid it"), given at
**JSConf México** (Guadalajara, October 29–30, 2026).

By **Leslie Herrera** · [linkedin.com/in/dereemii](https://linkedin.com/in/dereemii) · [@dereemii](https://x.com/dereemii)

🇪🇸 [Leer en español](README.es.md)

**Live site:** https://dereemii.github.io/ia-client-side-inp/

## What's here

| Demo | Folder | What it shows |
|------|--------|---------------|
| **Demo 01 · Live INP** | [`demo-1-inp/`](demo-1-inp/) | The same heavy work run three ways: **main thread**, **chunking** (yielding to the browser between pieces) and a **Web Worker**. It measures interaction latency (clicks and key presses) with the Event Timing API, and shows an animated dot and the FPS: if the dot freezes, the main thread was busy. |
| **Demo 02 · A real LLM in your browser** | [`demo-2-llm/`](demo-2-llm/) | `distilgpt2` (Hugging Face, via Transformers.js) generating text in three modes: **main thread**, **Worker + WASM** and **Worker + WebGPU**. |

The idea of the talk: the difference is not *how much* computation there is, but *where* it runs.

## Run them locally

The demos are static HTML, with no build step. But the Demo 2 Worker is an ES module,
so it **won't open from `file://`**: it needs to be served over HTTP.

```bash
git clone https://github.com/dereemii/ia-client-side-inp.git
cd ia-client-side-inp
python3 -m http.server 8000
# open http://localhost:8000
```

(Any static server works: `npx serve`, the VS Code Live Server extension, etc.)

### GitHub Pages

To publish your own copy with GitHub Pages: Settings → Pages → *Deploy from a branch* →
`main` / root. The demos end up at `https://<user>.github.io/<repo>/`, already over HTTPS.

## Requirements

- **A recent desktop browser.** Chrome or Edge to try **WebGPU**. If your browser doesn't
  support it, use the *Worker + WASM* mode: it works without a GPU.
- **An internet connection** the first time you open Demo 2: the library is loaded from
  jsDelivr and the model from Hugging Face. After that it stays in the browser cache.
  Download size is about 85 MB with WASM and about 330 MB with WebGPU.
- Use the **"Preparar modelos"** ("Prepare models") button in Demo 2 to preload them before
  comparing modes.

## Things worth knowing

- With a small model like `distilgpt2`, **WebGPU doesn't always win**: the fixed cost of
  talking to the GPU (compiling shaders, copying data CPU↔GPU, launching every operation for
  every token) can eat the gain. It pays off more with larger models.
- Moving inference to a Worker **doesn't make it faster**: it takes it off the main thread so
  the interface keeps responding. That is the difference INP measures.
- In Demo 1, only clicks and key presses are counted, since those are the interactions that
  count for INP; hover and scroll don't.

## Structure

```
.
├── index.html                  # home page: demos, talk and "About me" (light and dark theme, ES/EN)
├── assets/                     # home page illustrations
├── charla/                     # slides PDF (ia-client-side-inp.pdf)
├── demo-1-inp/index.html       # demo 01 (single file)
└── demo-2-llm/
    ├── index.html              # demo 02
    └── transformers-worker.js  # the actual Worker; must sit next to index.html
```

## Home page: language and slides

- The home page is in Spanish and English. The ES/EN button in the top bar switches the
  language and remembers it in the browser; the first time, it uses the browser's language.
  The texts live in the `I18N` dictionary at the end of `index.html`.
- The demos themselves are currently in Spanish only.
- The home page links to the talk slides at `charla/ia-client-side-inp.pdf`.

## Credits

- [Transformers.js](https://github.com/huggingface/transformers.js) (Hugging Face)
- Model [`Xenova/distilgpt2`](https://huggingface.co/Xenova/distilgpt2)
- Typefaces: IBM Plex Sans and JetBrains Mono (Google Fonts)
- Illustrations of Leslie, pixel art. See the note below.

## License

The code is released under the [MIT License](LICENSE).

The illustrations in `assets/` are personal artwork of the author and are **not** covered by
the MIT License; please ask before reusing them.
