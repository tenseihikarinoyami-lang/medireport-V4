<template>
  <div class="flex" style="min-height:100vh; background:#0a0a0f;">
    <!-- Sidebar -->
    <aside :class="['sidebar', { collapsed: store.sidebarCollapsed }]" style="position:fixed;">
      <!-- Logo -->
      <div style="padding:1.5rem 1.25rem; border-bottom:1px solid rgba(255,255,255,0.08);">
        <div style="display:flex; align-items:center; gap:0.75rem; overflow:hidden;">
          <div style="min-width:44px; width:44px; height:44px; border-radius:12px; background:linear-gradient(135deg,#00f3ff,#b026ff); display:flex; align-items:center; justify-content:center; font-size:1.5rem; flex-shrink:0;" class="animate-pulse-glow">🏥</div>
          <div v-if="!store.sidebarCollapsed" class="animate__animated animate__fadeIn" style="overflow:hidden;">
            <h1 class="font-display" style="font-size:1.1rem; font-weight:800; background:linear-gradient(135deg,#00f3ff,#b026ff,#ff00aa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; white-space:nowrap;">MediReport</h1>
            <p style="font-size:0.6rem; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.15em; white-space:nowrap;">Pro V4</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav style="flex:1; overflow-y:auto; padding:1rem 0;" class="custom-scrollbar">
        <router-link v-for="item in menuItems" :key="item.path" :to="item.path" :class="['sidebar-item', { active: $route.path === item.path }]">
          <span style="font-size:1.25rem; flex-shrink:0;">{{ item.icon }}</span>
          <span v-if="!store.sidebarCollapsed" class="animate__animated animate__fadeIn" style="white-space:nowrap;">{{ item.name }}</span>
          <div v-if="item.badge && !store.sidebarCollapsed" style="margin-left:auto; background:#ff00aa; border-radius:999px; padding:0.1rem 0.5rem; font-size:0.55rem; font-weight:800; box-shadow:0 0 10px rgba(255,0,170,0.5);" class="animate-pulse-slow">{{ item.badge }}</div>
        </router-link>

        <!-- Admin section -->
        <template v-if="store.isAdminOrCoord">
          <div v-if="!store.sidebarCollapsed" style="padding:1rem 1.5rem 0.5rem; font-size:0.6rem; color:rgba(255,255,255,0.3); text-transform:uppercase; letter-spacing:0.12em; font-weight:700;">Administración</div>
          <router-link to="/app/usuarios" :class="['sidebar-item', { active: $route.path === '/app/usuarios' }]">
            <span style="font-size:1.25rem; flex-shrink:0;">👥</span>
            <span v-if="!store.sidebarCollapsed">Usuarios</span>
          </router-link>
          <router-link to="/app/seguimiento" :class="['sidebar-item', { active: $route.path === '/app/seguimiento' }]">
            <span style="font-size:1.25rem; flex-shrink:0;">✅</span>
            <span v-if="!store.sidebarCollapsed">Seguimiento</span>
          </router-link>
        </template>
      </nav>

      <!-- User info at bottom -->
      <div style="border-top:1px solid rgba(255,255,255,0.08); padding:1rem 1.25rem;">
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <div style="min-width:36px; width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,#b026ff,#ff00aa); display:flex; align-items:center; justify-content:center; font-size:1rem; flex-shrink:0;">
            {{ store.currentUser?.avatar || '👤' }}
          </div>
          <div v-if="!store.sidebarCollapsed" style="flex:1; min-width:0; overflow:hidden;">
            <p style="font-size:0.75rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ store.currentUser?.name }}</p>
            <p style="font-size:0.6rem; color:rgba(255,255,255,0.4); text-transform:capitalize;">{{ store.currentUser?.role }}</p>
          </div>
          <button v-if="!store.sidebarCollapsed" @click="handleLogout" style="background:none; border:none; color:rgba(255,255,255,0.4); cursor:pointer; padding:0.25rem; border-radius:6px; transition:color 0.2s;" title="Cerrar sesión">🚪</button>
        </div>
      </div>

      <!-- Toggle button -->
      <button @click="store.toggleSidebar" style="position:absolute; right:-14px; top:50%; transform:translateY(-50%); width:28px; height:48px; background:linear-gradient(180deg,#00f3ff,#b026ff); border:none; border-radius:0 8px 8px 0; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:0.75rem; color:white; box-shadow:4px 0 15px rgba(0,243,255,0.3); z-index:101; transition:all 0.3s;">
        {{ store.sidebarCollapsed ? '→' : '←' }}
      </button>
    </aside>

    <!-- Mobile overlay -->
    <div v-if="mobileOpen" @click="mobileOpen=false" style="position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:90;" />

    <!-- Main content area -->
    <main :class="['main-content', { 'sidebar-collapsed': store.sidebarCollapsed }]" style="flex:1;">
      <!-- Header -->
      <header class="glass-strong" style="position:sticky; top:0; z-index:50; border-bottom:1px solid rgba(255,255,255,0.08); padding:1rem 2rem; display:flex; align-items:center; justify-content:space-between;">
        <div>
          <h2 class="font-display" style="font-size:1.5rem; font-weight:800; background:linear-gradient(135deg,#00f3ff,#b026ff); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">{{ currentTitle }}</h2>
          <p style="font-size:0.7rem; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:0.1em; margin-top:0.1rem;">{{ currentDate }}</p>
        </div>
        <div style="display:flex; align-items:center; gap:1rem;">
          <!-- Alerts bell -->
          <router-link to="/app/alertas" style="position:relative; padding:0.6rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:10px; text-decoration:none; transition:all 0.3s; font-size:1.25rem;" title="Alertas">
            🔔
            <span v-if="unreadCount > 0" style="position:absolute; top:-6px; right:-6px; background:#ff00aa; border-radius:50%; width:18px; height:18px; font-size:0.6rem; display:flex; align-items:center; justify-content:center; font-weight:800; box-shadow:0 0 10px rgba(255,0,170,0.6);" class="animate-pulse-slow">{{ unreadCount }}</span>
          </router-link>
          <!-- Profile -->
          <router-link to="/app/perfil" style="display:flex; align-items:center; gap:0.5rem; padding:0.5rem 1rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:10px; text-decoration:none; transition:all 0.3s; font-size:0.8rem; color:white;">
            <span>{{ store.currentUser?.avatar || '👤' }}</span>
            <span style="font-weight:600;">{{ store.currentUser?.name?.split(' ')[0] }}</span>
          </router-link>
        </div>
      </header>

      <!-- Page content -->
      <div style="padding:2rem; max-width:1400px; margin:0 auto;">
        <!-- Background glows -->
        <div style="position:fixed; top:0; right:0; width:500px; height:500px; background:rgba(0,243,255,0.03); border-radius:50%; filter:blur(120px); pointer-events:none; z-index:0;" class="animate-pulse-slow" />
        <div style="position:fixed; bottom:0; left:280px; width:400px; height:400px; background:rgba(176,38,255,0.03); border-radius:50%; filter:blur(120px); pointer-events:none; z-index:0;" class="animate-pulse-slow" />
        <div style="position:relative; z-index:1;">
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '../stores/mainStore'

const store = useMainStore()
const route = useRoute()
const router = useRouter()
const mobileOpen = ref(false)

const unreadCount = computed(() => store.getUnreadAlerts.length)
const currentTitle = computed(() => route.meta?.title || 'Dashboard')
const currentDate = computed(() => new Date().toLocaleDateString('es-VE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))

const menuItems = computed(() => {
  const base = [
    { path: '/app/dashboard', name: 'Dashboard', icon: '📊' },
    { path: '/app/reportes', name: 'Reportes', icon: '📋' },
    { path: '/app/jornadas', name: 'Jornadas', icon: '🗺️' },
    { path: '/app/alertas', name: 'Alertas', icon: '🔔', badge: unreadCount.value > 0 ? unreadCount.value : null },
    { path: '/app/perfil', name: 'Mi Perfil', icon: '⚙️' },
  ]
  return base
})

function handleLogout() {
  store.logout()
  router.push('/login')
}
</script>

<style scoped>
.page-enter-active, .page-leave-active { transition: all 0.25s ease; }
.page-enter-from { opacity: 0; transform: translateY(10px); }
.page-leave-to { opacity: 0; transform: translateY(-10px); }
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 999px; }
</style>
