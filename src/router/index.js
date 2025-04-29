import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Filter from '../views/Filter.vue'
import History from '../views/History.vue'
import About from '../views/About.vue'
import Help from '../views/Help.vue'
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import BookDetails from "../views/BookDetails.vue";
import AdminLayout from "../layouts/AdminLayout.vue";
import viewAll from "../views/viewall.vue" ;
import Account from "../views/AccountManagement.vue";
import Campus from "../views/CampusManagement.vue";
import Dashboard from "../views/GeneralDashboard.vue";
import Publication from "../views/PublicationManagement.vue";

const routes = [
    { path: '/', redirect: '/home' },
    { path: '/home', component: Home },
    { path: '/filter', component: Filter },
    { path: '/history', component: History },
    { path: '/about', component: About },
    { path: '/help', component: Help },
    { path: "/login", name: "Login", component: Login },
    { path: "/signup", name: "Signup", component: Signup },
    { path: '/book/:serialnum',name: "BookDetails", component: BookDetails },
    { path: '/admin', name:"adminLayout", component: AdminLayout },
    { path: '/view', name:"viewAll", component: viewAll },
    { path: '/Account', name:"AccountManagement", component: Account},
    { path: '/Campus', name:"CampusManagement", component: Campus},
    { path: '/Dashboard', name:"GeneralDashboard", component: Dashboard},
    { path: '/Publication', name:"PublicationManagement", component: Publication},
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router