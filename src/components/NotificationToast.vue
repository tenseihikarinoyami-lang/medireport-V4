<template>
  <div class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full">
    <TransitionGroup 
      enter-active-class="animate__animated animate__fadeInRight animate__faster"
      leave-active-class="animate__animated animate__fadeOutRight animate__faster"
    >
      <div 
        v-for="note in notifications" 
        :key="note.id"
        :class="[
          'glass-strong p-4 rounded-2xl shadow-2xl flex items-start gap-3 border-l-4',
          typeClasses[note.type]
        ]"
      >
        <span class="text-xl">{{ typeIcons[note.type] }}</span>
        <div class="flex-1">
          <p class="text-sm font-medium text-white">{{ note.message }}</p>
        </div>
        <button @click="remove(note.id)" class="text-white/40 hover:text-white transition-colors">
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMainStore } from '../stores/mainStore'

const store = useMainStore()
const notifications = computed(() => store.notifications)

const typeClasses = {
  info: 'border-neon-blue shadow-neon-blue/10',
  success: 'border-neon-green shadow-neon-green/10',
  warning: 'border-neon-yellow shadow-neon-yellow/10',
  error: 'border-neon-pink shadow-neon-pink/10'
}

const typeIcons = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '🚨'
}

const remove = (id) => {
  store.notifications = store.notifications.filter(n => n.id !== id)
}
</script>
