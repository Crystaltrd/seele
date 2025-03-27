import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Filter from '../views/Filter.vue'
import History from '../views/History.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import Help from '../views/Help.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/filter', component: Filter },
    { path: '/history', component: History },
    { path: '/about', component: About },
    { path: '/contact', component: Contact },
    { path: '/help', component: Help }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router