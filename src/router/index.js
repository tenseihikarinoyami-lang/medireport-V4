import { createRouter, createWebHistory } from 'vue-router'
import { useMainStore } from '../stores/mainStore'

const routes = [
    { path: '/', name: 'Landing', component: () => import('../views/LandingView.vue'), meta: { title: 'Inicio' } },
    { path: '/login', name: 'Login', component: () => import('../views/LoginView.vue'), meta: { title: 'Iniciar Sesión' } },
    {
        path: '/app',
        component: () => import('../views/AppLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            { path: 'dashboard', name: 'Dashboard', component: () => import('../views/DashboardView.vue'), meta: { title: 'Dashboard', icon: '📊' } },
            { path: 'reportes', name: 'Reports', component: () => import('../views/ReportsView.vue'), meta: { title: 'Reportes', icon: '📋' } },
            { path: 'reportes/nuevo', name: 'NewReport', component: () => import('../views/ReportWizardView.vue'), meta: { title: 'Nuevo Reporte', icon: '📝' } },
            { path: 'jornadas', name: 'Jornadas', component: () => import('../views/JornadasView.vue'), meta: { title: 'Jornadas de Salud', icon: '🗺️' } },
            { path: 'alertas', name: 'Alerts', component: () => import('../views/AlertsView.vue'), meta: { title: 'Alertas', icon: '🔔' } },
            { path: 'usuarios', name: 'Users', component: () => import('../views/UsersView.vue'), meta: { title: 'Usuarios', icon: '👥', adminOnly: true } },
            { path: 'seguimiento', name: 'Tracking', component: () => import('../views/TrackingView.vue'), meta: { title: 'Seguimiento', icon: '✅', adminOnly: true } },
            { path: 'perfil', name: 'Profile', component: () => import('../views/ProfileView.vue'), meta: { title: 'Mi Perfil', icon: '⚙️' } },
        ]
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to) {
        if (to.hash) return { el: to.hash, behavior: 'smooth' }
        return { top: 0 }
    }
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        const store = useMainStore()
        store.initFromStorage()
        if (!store.currentUser) { next('/login'); return }
    }
    if (to.path === '/login') {
        const store = useMainStore()
        store.initFromStorage()
        if (store.currentUser) { next('/app/dashboard'); return }
    }
    next()
})

export default router
