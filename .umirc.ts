import { defineConfig } from "umi";

export default defineConfig({
  npmClient: "pnpm",
  favicons: ["/favicon.svg"],
  routes: [
    { path: "/", component: "@/pages/EditPage" },
    { path: "/login", component: "@/pages/Login" },
  ],

  tailwindcss: {},
  plugins: ["@umijs/plugins/dist/tailwindcss"],
});
