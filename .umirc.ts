import { defineConfig } from "umi";

export default defineConfig({
  npmClient: "pnpm",
  favicons: ["/favicon.svg"],
  routes: [
    { path: "/", component: "@/pages/EditPage" },
    { path: "/login", component: "@/pages/Login" },
    { path: "/test", component: "@/pages/TestPage" },
  ],

  tailwindcss: {},
  plugins: ["@umijs/plugins/dist/tailwindcss"],
});
