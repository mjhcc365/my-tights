import { defineConfig } from "umi";

export default defineConfig({
  npmClient: "pnpm",
  favicons: ["/favicon.svg"],
  routes: [
    { path: "/", component: "@/pages/index" },
    { path: "/login", component: "@/pages/Login" },
  ],

  tailwindcss: {},
  plugins: ["@umijs/plugins/dist/tailwindcss"],
});
