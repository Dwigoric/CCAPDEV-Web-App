import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import PostView from '../views/PostView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/feed',
            name: 'feed',
            // route level code-splitting
            // this generates a separate chunk (FeedView.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/FeedView.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView
        },
        {
            path: '/post',
            name: 'post',
            component: PostView
        }
    ]
})

export default router
