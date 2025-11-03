import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Importar o 'path' do Node.js

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Configuração dos aliases (como @/)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // A MÁGICA ACONTECE AQUI:
  // Configuração do servidor de desenvolvimento
  server: {
    proxy: {
      // Redireciona qualquer pedido que comece com /api
      // para o seu servidor backend na porta 3000
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true, // Necessário para o proxy funcionar corretamente
        secure: false,      // Se o seu backend não tiver HTTPS
      }
    }
  }
})
