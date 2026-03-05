import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'
import 'animate.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

// V5: Register Service Worker for PWA + Push Notifications
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => {
                console.log('[PWA] Service Worker registered:', reg.scope)
                // Request push notification permission
                if ('Notification' in window && Notification.permission === 'default') {
                    Notification.requestPermission().then(p => console.log('[PWA] Notification permission:', p))
                }
            })
            .catch(err => console.warn('[PWA] SW registration failed:', err))
    })
}
