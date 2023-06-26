import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import PostView from '../views/PostView.vue'
import SearchView from '../views/SearchView.vue'

// Import stores
import { useSpecificPostStore } from '../stores/currentPost'
import { useLoggedInStore } from '../stores/loggedIn'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            beforeEnter: (to, from, next) => {
                const loggedInStore = useLoggedInStore()
                if (loggedInStore.username) next({ name: 'feed' })
                else next()
            }
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
            component: RegisterView,
            beforeEnter: (to, from, next) => {
                const loggedInStore = useLoggedInStore()
                if (loggedInStore.username) next({ name: 'feed' })
                else next()
            }
        },
        {
            path: '/post',
            name: 'post',
            component: PostView,
            beforeEnter: (to, from, next) => {
                const postStore = useSpecificPostStore()
                if (postStore.currentPostId === null) next({ name: 'feed' })
                else next()
            }
        },
        {
            path: '/search',
            name: 'search',
            component: SearchView
        },
        {
            path: '/profile',
            name: 'profile',
            component: ProfileView
        }
    ]
})

export default router
