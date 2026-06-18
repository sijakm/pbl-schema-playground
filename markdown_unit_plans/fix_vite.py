import os

playgrounds = [
    'direct_instructions_markdown',
    'inquiry_markdown',
    'lab_markdown',
    'collaborative_markdown',
    'pbl_markdown'
]

config = """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: ['..', '../..']
    }
  }
})
"""

for folder in playgrounds:
    path = os.path.join(folder, "vite.config.js")
    with open(path, 'w') as f:
        f.write(config)

print("Fixed vite.config.js")
