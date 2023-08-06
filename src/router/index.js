import { createRouter, createWebHistory } from 'vue-router'
import FeedView from '../views/FeedView.vue'
import SearchView from '../views/SearchView.vue'

// Import stores
import { useLoggedInStore } from '../stores/loggedIn'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/HomeView.vue'),
            beforeEnter: (to, from, next) => {
                const credentials = window.$cookies.get('credentials')
                if (credentials) next({ name: 'feed' })
                else next()
            }
        },
        {
            path: '/feed',
            name: 'feed',
            component: FeedView
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../views/RegisterView.vue'),
            beforeEnter: (to, from, next) => {
                const loggedInStore = useLoggedInStore()
                if (loggedInStore.username) next({ name: 'feed' })
                else next()
            }
        },
        {
            path: '/post/:id',
            name: 'post',
            component: () => import('../views/PostView.vue'),
            props: true
        },
        {
            path: '/search',
            name: 'search',
            component: SearchView,
            props: (route) => ({ query: route.query.q })
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutView.vue')
        },
        {
            path: '/profile/:username',
            name: 'profile',
            component: () => import('../views/ProfileView.vue'),
            props: true
        },
        {
            // Catch-all 404
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('../views/NotFoundView.vue')
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    // eslint-disable-next-line no-undef
    NProgress.start()
    next()
})

router.afterEach(() => {
    // eslint-disable-next-line no-undef
    NProgress.done()
})

export default router
