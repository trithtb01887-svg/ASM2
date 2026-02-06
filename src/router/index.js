import { createRouter, createWebHistory } from 'vue-router'
import PostService from '@/services/PostService' // Keeping imports clean

// Import Views
import HomeView from '@/views/HomeView.vue'
import PostDetailView from '@/views/PostDetailView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import UserDashboardView from '@/views/UserDashboardView.vue'
import PostEditorView from '@/views/PostEditorView.vue'
import AdminDashboardView from '@/views/AdminDashboardView.vue' // Keeping legacy if present
import UserProfileView from '@/views/UserProfileView.vue' // New
import AdminUserManager from '@/views/AdminUserManager.vue' // New

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/posts/:id',
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
            // Assuming we handle auth logic inside components or global guard
            // but component-level logic was requested.
        },
        {
            path: '/posts/new',
            name: 'create-post',
            component: PostEditorView
        },
        {
            path: '/posts/edit/:id',
            name: 'edit-post',
            component: PostEditorView,
            props: true
        },
        // NEW ROUTES
        {
            path: '/profile',
            name: 'profile',
            component: UserProfileView
        },
        {
            path: '/admin/users',
            name: 'admin-users',
            component: AdminUserManager
        },
        // Existing Admin route if needed
        {
            path: '/admin',
            name: 'admin',
            component: AdminDashboardView
        }
    ]
})

export default router
