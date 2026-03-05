<template>
  <div style="display:flex; flex-direction:column; gap:1.5rem;" class="animate__animated animate__fadeIn">

    <!-- Header -->
    <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
      <div>
        <h2 class="font-display" style="font-size:1.5rem; font-weight:800;">Alertas del Sistema</h2>
        <p style="color:rgba(255,255,255,0.4); font-size:0.8rem;">Notificaciones epidemiológicas y administrativas</p>
      </div>
      <div style="display:flex; gap:0.75rem;">
        <button @click="store.markAllAlertsRead()" class="btn-glass" style="font-size:0.8rem;">✓ Marcar todas leídas</button>
        <button v-if="store.canCreateAlerts" @click="showNewModal=true" class="btn-primary">🔔 Nueva Alerta</button>
      </div>
    </div>

    <!-- Stats -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:1rem;">
      <div v-for="s in alertStats" :key="s.label" class="card-glass">
        <p style="font-size:0.65rem; text-transform:uppercase; letter-spacing:0.1em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.5rem;">{{ s.label }}</p>
        <p style="font-size:2rem; font-weight:900;" :style="{color:s.color}">{{ s.value }}</p>
      </div>
    </div>

    <!-- Alerts list -->
    <div style="display:flex; flex-direction:column; gap:0.75rem;">
      <div v-for="alert in store.alerts" :key="alert.id"
        :style="{
          padding:'1.25rem', borderRadius:'1rem', cursor:'default', transition:'all 0.3s',
          background: !alert.leida ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
          border: '1px solid ' + (!alert.leida ? prioColor(alert.prioridad)+'55' : 'rgba(255,255,255,0.06)'),
          boxShadow: !alert.leida ? '0 0 20px ' + prioColor(alert.prioridad)+'20' : 'none'
        }">
        <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:1rem;">
          <div style="display:flex; align-items:flex-start; gap:1rem; flex:1;">
            <div :style="{width:'44px',height:'44px',borderRadius:'10px',background:prioColor(alert.prioridad)+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.25rem',flexShrink:0}">
              {{ alert.tipo==='urgent' ? '🚨' : alert.tipo==='warning' ? '⚠️' : 'ℹ️' }}
            </div>
            <div style="flex:1;">
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem; flex-wrap:wrap;">
                <h3 style="font-size:0.9rem; font-weight:700;">{{ alert.titulo }}</h3>
                <span :class="['badge', prioBadge(alert.prioridad)]">{{ alert.prioridad }}</span>
                <span v-if="!alert.leida" class="badge badge-info animate-pulse-slow">NUEVA</span>
              </div>
              <p style="font-size:0.8rem; color:rgba(255,255,255,0.6); line-height:1.5;">{{ alert.mensaje }}</p>
              <p style="font-size:0.65rem; color:rgba(255,255,255,0.3); margin-top:0.5rem;">Por {{ alert.emitidaPor }} · {{ new Date(alert.fecha).toLocaleString('es-VE') }}</p>
            </div>
          </div>
          <button v-if="!alert.leida" @click="store.markAlertRead(alert.id)" style="padding:0.4rem 0.75rem; background:rgba(0,243,255,0.1); border:1px solid rgba(0,243,255,0.2); border-radius:0.5rem; color:#00f3ff; cursor:pointer; font-size:0.7rem; font-weight:700; flex-shrink:0; transition:all 0.2s;">Leída</button>
        </div>
      </div>
    </div>

    <div v-if="store.alerts.length === 0" style="text-align:center; padding:4rem; color:rgba(255,255,255,0.3);">
      <div style="font-size:4rem; margin-bottom:1rem;">🔕</div>
      <p>No hay alertas registradas</p>
    </div>

    <!-- New Alert Modal (admin/coord only) -->
    <div v-if="showNewModal" class="modal-overlay" @click.self="showNewModal=false">
      <div class="glass-strong" style="max-width:500px; width:100%; border-radius:1.5rem; padding:2rem; border:1px solid rgba(255,255,255,0.1);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem;">
          <h3 class="font-display" style="font-size:1.25rem; font-weight:800;">🔔 Nueva Alerta</h3>
          <button @click="showNewModal=false" style="background:none; border:none; color:rgba(255,255,255,0.5); cursor:pointer; font-size:1.25rem;">✕</button>
        </div>
        <div style="display:flex; flex-direction:column; gap:1rem;">
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Título</label>
            <input v-model="newAlert.titulo" type="text" class="input-glass" placeholder="Alerta epidemiológica..." />
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div>
              <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Tipo</label>
              <select v-model="newAlert.tipo" class="input-glass">
                <option value="urgent">🚨 Urgente</option>
                <option value="warning">⚠️ Advertencia</option>
                <option value="info">ℹ️ Informativa</option>
              </select>
            </div>
            <div>
              <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Prioridad</label>
              <select v-model="newAlert.prioridad" class="input-glass">
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          </div>
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Mensaje</label>
            <textarea v-model="newAlert.mensaje" class="input-glass" rows="3" placeholder="Descripción de la alerta..." style="resize:vertical;" />
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:0.25rem;">
            <button @click="showNewModal=false" class="btn-glass">Cancelar</button>
            <button @click="createAlert" class="btn-primary" :disabled="!newAlert.titulo">🔔 Publicar Alerta</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useMainStore } from '../stores/mainStore'

const store = useMainStore()
const showNewModal = ref(false)
const newAlert = reactive({ titulo: '', tipo: 'info', prioridad: 'media', mensaje: '' })

const alertStats = computed(() => [
  { label: 'Urgentes', value: store.alerts.filter(a => a.prioridad==='alta').length, color: '#ff00aa' },
  { label: 'Advertencias', value: store.alerts.filter(a => a.prioridad==='media').length, color: '#ffee00' },
  { label: 'Informativas', value: store.alerts.filter(a => a.prioridad==='baja').length, color: '#00f3ff' },
  { label: 'Sin leer', value: store.getUnreadAlerts.length, color: '#00ff88' },
])

const prioColor = (p) => ({ alta: '#ff00aa', media: '#ffee00', baja: '#00f3ff' }[p] || '#fff')
const prioBadge = (p) => ({ alta: 'badge-danger', media: 'badge-warning', baja: 'badge-info' }[p] || 'badge-info')

function createAlert() {
  store.addAlert({ titulo: newAlert.titulo, tipo: newAlert.tipo, prioridad: newAlert.prioridad, mensaje: newAlert.mensaje })
  showNewModal.value = false
  Object.assign(newAlert, { titulo: '', tipo: 'info', prioridad: 'media', mensaje: '' })
}
</script>
