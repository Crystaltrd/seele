import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 5179,
        open: true,
        allowedHosts: ['seele.serveo.net']
    },
    define: {
        apiurl: JSON.stringify('https://crystal.midori-ai.xyz/cgi-bin/'),
        pubURL: JSON.stringify('/src/assets/covers/')
    }
})
