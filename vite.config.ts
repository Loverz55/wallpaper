import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import path from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  //解决"vite use `--host` to expose"
  base: './',
  server: {             
    host: '0.0.0.0',	
    // port: 8080,      
    open: true,
    proxy: {
      '/api': {
        target: 'https://api.mmp.cc/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    },
  },
  resolve:{   
    //别名配置，引用src路径下的东西可以通过@如：import Layout from '@/layout/index.vue'
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  }
})
