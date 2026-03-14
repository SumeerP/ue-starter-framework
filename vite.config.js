import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    return {
        plugins: [react(), basicSsl()],
        base: command === 'build' ? '/ue-starter-framework/' : '/',
        server: {
            https: true,
            port: 3000,
        }
    }
})
