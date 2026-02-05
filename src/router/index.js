import { createRouter, createWebHistory } from 'vue-router'
import UserService from '@/services/UserService'

// Import views (will create them next)
import HomeView from '@/views/HomeView.vue'
import PostDetailView from '@/views/PostDetailView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import UserDashboardView from '@/views/UserDashboardView.vue'
import PostEditorView from '@/views/PostEditorView.vue'
import AdminDashboardView from '@/views/AdminDashboardView.vue'
import UserProfileView from '@/views/UserProfileView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/post/:id',
            name: 'post-detail',
            component: PostDetailView,
            props: true
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: UserDashboardView,
            meta: { requiresAuth: true }
        },
        {
            path: '/profile',
            name: 'profile',
            component: UserProfileView,
            meta: { requiresAuth: true }
        },
        {
            path: '/posts/new',
            name: 'create-post',
            component: PostEditorView,
            meta: { requiresAuth: true }
        },
        {
            path: '/posts/edit/:id',
            name: 'edit-post',
            component: PostEditorView,
            props: true,
            meta: { requiresAuth: true }
        },
        {
            path: '/admin',
            name: 'admin',
            component: AdminDashboardView,
            meta: { requiresAuth: true, requiresAdmin: true }
        }
    ]
})

// Route Guards
router.beforeEach((to, from, next) => {
    const currentUser = UserService.getCurrentUser();
    const isAuthenticated = !!currentUser;
    const isAdmin = currentUser?.role === 'admin';

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'login' });
    } else if (to.meta.requiresAdmin && !isAdmin) {
        next({ name: 'home' }); // Or error page
    } else {
        next();
    }
})

export default router
