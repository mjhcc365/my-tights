import { defineConfig } from 'umi';
import { Platform, Arch } from '@umijs/plugin-electron';

export default defineConfig({
  npmClient: 'yarn',
  favicons: ["/favicon.svg"],
});
