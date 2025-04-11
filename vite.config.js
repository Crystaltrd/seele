import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {stringifyQuery} from "vue-router";

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 5179,
        open: true,
    },
    define: {
        apiurl: JSON.stringify('https://crystal.tilde.institute/mellow/')
    }
})
