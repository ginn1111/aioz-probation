import {resolve} from 'path' 
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import alias from '@rollup/plugin-alias'

const projectRootDir = resolve(__dirname);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
    alias({
  entries: [
          {
            find: '@',
            replacement: resolve(projectRootDir, 'src')
          }
        ]
      })

    ],
})
