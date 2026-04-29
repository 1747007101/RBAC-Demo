import { defineConfig } from "unocss";

export default defineConfig({
  presets: [
    import("@unocss/preset-uno").then((m) => m.default()),
    import("@unocss/preset-attributify").then((m) => m.default()),
  ],
});
