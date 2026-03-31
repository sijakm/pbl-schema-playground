import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-config-local',
      configureServer(server) {
        server.middlewares.use('/config.local.js', (req, res, next) => {
          const configPath = path.resolve(__dirname, '../config.local.js')
          if (fs.existsSync(configPath)) {
            res.setHeader('Content-Type', 'application/javascript')
            res.end(fs.readFileSync(configPath, 'utf-8'))
          } else {
            res.setHeader('Content-Type', 'application/javascript')
            res.end('window.LOCAL_CONFIG = {};')
          }
        })
      }
    }
  ],
})
