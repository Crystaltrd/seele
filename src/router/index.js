import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Filter from '../views/Filter.vue'
import History from '../views/History.vue'
import About from '../views/About.vue'
import Help from '../views/Help.vue'
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import BookDetails from "../views/BookDetails.vue";

const routes = [
    { path: '/', redirect: '/home' },
    { path: '/home', component: Home },
    { path: '/filter', component: Filter },
    { path: '/history', component: History },
    { path: '/about', component: About },
    { path: '/help', component: Help },
    { path: "/login", name: "Login", component: Login },
    { path: "/signup", name: "Signup", component: Signup },
    { path: '/book/:id',name: "BookDetails", component: BookDetails },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router