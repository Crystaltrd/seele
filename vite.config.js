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
        apiurl: JSON.stringify('https://mellow.serveo.net/'),
        assetsurl: JSON.stringify('https://crystal.tilde.institute/mellow/')
    }
})
