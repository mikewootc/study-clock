import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
//import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')  // 为./src配置别名
    }
  },
  plugins: [
    vue(),
    //VitePWA({
    //  manifest: {
    //    name: "Pomodoro", // 安装应用后显示的应用名
    //    description: "A Pomodoro Clock",
    //    // 图标
    //    icons: [
    //      {
    //        // 注意如果应用不是部署在站点根目录则需要相对路径，图片文件放在项目/public/pwa/192x192.png
    //        src: "./favicon.png",
    //        sizes: "150x150",
    //        type: "image/png",
    //      },
    //    ],
    //  },
    //  registerType: "autoUpdate",
    //  workbox: {
    //    // 对所有匹配的静态资源进行缓存
    //    globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
    //  },
    //  devOptions: {
    //    enabled: true,
    //  },
    //}),
  ],
});
