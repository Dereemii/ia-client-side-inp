import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2";

env.allowLocalModels = false;
env.backends.onnx.wasm.numThreads = 1;

const MODEL_ID = "Xenova/distilgpt2";
const pipelines = {};

async function getPipeline(device) {
  if (!pipelines[device]) {
    pipelines[device] = pipeline("text-generation", MODEL_ID, { device });
  }
  return pipelines[device];
}

self.onmessage = async function (e) {
  const { id, device, prompt, maxNewTokens } = e.data;
  try {
    const loadStart = performance.now();
    const generator = await getPipeline(device);
    const loadMs = performance.now() - loadStart;

    const genStart = performance.now();
    const out = await generator(prompt, { max_new_tokens: maxNewTokens, do_sample: false });
    const genMs = performance.now() - genStart;

    const text = Array.isArray(out) ? out[0].generated_text : out.generated_text;
    self.postMessage({ id, ok: true, text, loadMs, genMs });
  } catch (err) {
    self.postMessage({ id, ok: false, error: (err && (err.stack || err.message)) || String(err) });
  }
};

self.onerror = function (e) {
  self.postMessage({ id: "__fatal__", ok: false, error: "Worker top-level error: " + (e && e.message ? e.message : String(e)) });
};
