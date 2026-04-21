import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/kanwil-app/", // ⬅️ WAJIB
  build: {
    chunkSizeWarningLimit: 1000, // Menghilangkan warning untuk file di bawah 1MB
    rollupOptions: {
      output: {
        // Memecah bundle menjadi file-file kecil
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("jspdf")) return "vendor-pdf"; // Khusus library PDF
            if (id.includes("react")) return "vendor-react"; // Khusus React
            if (id.includes("@fortawesome")) return "vendor-icons"; // Khusus Icon
            return "vendor"; // Sisa library lainnya
          }
        },
      },
    },
  },
})