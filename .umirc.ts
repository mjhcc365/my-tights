import { defineConfig } from 'umi';
import { Platform, Arch } from '@umijs/plugin-electron';

export default defineConfig({
  npmClient: 'yarn',
  favicons: ["/favicon.svg"],
  routes: [
    { path: '/', component:'@/pages/index' },
    { path: '/login', component: '@/pages/Login' },
  ],
});
