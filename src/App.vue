<template>
  <div>
    <router-view />
    <!-- Global Toast Notifications -->
    <div class="toast-container">
      <transition-group name="toast-anim" tag="div" style="display:flex;flex-direction:column;gap:0.5rem">
        <div
          v-for="n in store.notifications"
          :key="n.id"
          :class="['toast', `toast-${n.type}`]"
        >
          <span class="text-lg">
            {{ n.type === 'success' ? '✅' : n.type === 'error' ? '❌' : n.type === 'warning' ? '⚠️' : 'ℹ️' }}
          </span>
          <span>{{ n.message }}</span>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from './stores/mainStore'
const store = useMainStore()
store.initFromStorage()
</script>

<style>
.toast-anim-enter-active { animation: slide-up 0.3s ease-out; }
.toast-anim-leave-active { animation: slide-up 0.3s ease-in reverse; }
</style>
