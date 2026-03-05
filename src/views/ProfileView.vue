<template>
  <div style="display:flex; flex-direction:column; gap:1.5rem;" class="animate__animated animate__fadeIn">
    <!-- Profile card -->
    <div class="glass-strong" style="border-radius:1.5rem; padding:2rem; border:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; gap:2rem; flex-wrap:wrap;">
      <div style="width:88px; height:88px; border-radius:20px; background:linear-gradient(135deg,#b026ff,#ff00aa); display:flex; align-items:center; justify-content:center; font-size:3rem; box-shadow:0 0 30px rgba(176,38,255,0.4);" class="animate-bounce-slow">
        {{ store.currentUser?.avatar || '👤' }}
      </div>
      <div>
        <h2 class="font-display" style="font-size:1.75rem; font-weight:900; line-height:1.2;">{{ store.currentUser?.name }}</h2>
        <div style="display:flex; align-items:center; gap:0.75rem; margin-top:0.5rem; flex-wrap:wrap;">
          <span :class="['badge', roleBadge(store.currentUser?.role)]" style="text-transform:capitalize;">{{ store.currentUser?.role }}</span>
          <span style="font-size:0.8rem; color:rgba(255,255,255,0.5);">{{ store.currentUser?.specialty }}</span>
        </div>
        <p style="font-size:0.75rem; color:rgba(255,255,255,0.4); margin-top:0.4rem;">{{ store.currentUser?.center }} · {{ store.currentUser?.asic }}</p>
      </div>
      <div style="margin-left:auto;">
        <button @click="editMode=!editMode" class="btn-primary">{{ editMode ? '✕ Cancelar' : '✏️ Editar Perfil' }}</button>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; flex-wrap:wrap;">
      <!-- Edit profile -->
      <div class="glass-strong" style="border-radius:1.5rem; padding:1.75rem; border:1px solid rgba(255,255,255,0.08);">
        <h3 class="font-display" style="font-size:1rem; font-weight:800; margin-bottom:1.25rem;">{{ editMode ? '✏️ Editar Información' : '👤 Información Personal' }}</h3>
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <div v-if="!editMode">
            <div v-for="(v, k) in profileInfo" :key="k" style="display:flex; justify-content:space-between; padding:0.6rem 0.75rem; background:rgba(255,255,255,0.03); border-radius:0.75rem; margin-bottom:0.35rem;">
              <span style="font-size:0.7rem; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.08em; font-weight:700;">{{ k }}</span>
              <span style="font-size:0.8rem; font-weight:600;">{{ v }}</span>
            </div>
          </div>
          <div v-else style="display:flex; flex-direction:column; gap:0.75rem;">
            <div>
              <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Nombre</label>
              <input v-model="editForm.name" type="text" class="input-glass" />
            </div>
            <div>
              <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Teléfono</label>
              <input v-model="editForm.phone" type="text" class="input-glass" />
            </div>
            <div>
              <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Especialidad</label>
              <input v-model="editForm.specialty" type="text" class="input-glass" />
            </div>
            <button @click="saveProfile" class="btn-primary" style="margin-top:0.5rem;">💾 Guardar Cambios</button>
          </div>
        </div>
      </div>

      <!-- Change password -->
      <div class="glass-strong" style="border-radius:1.5rem; padding:1.75rem; border:1px solid rgba(255,255,255,0.08);">
        <h3 class="font-display" style="font-size:1rem; font-weight:800; margin-bottom:1.25rem;">🔒 Cambiar Contraseña</h3>
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Contraseña Actual</label>
            <input v-model="pwdForm.current" type="password" class="input-glass" placeholder="••••••••" />
          </div>
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Nueva Contraseña</label>
            <input v-model="pwdForm.newPwd" type="password" class="input-glass" placeholder="••••••••" />
          </div>
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Confirmar Nueva</label>
            <input v-model="pwdForm.confirm" type="password" class="input-glass" placeholder="••••••••" />
          </div>
          <p v-if="pwdError" style="font-size:0.75rem; color:#ff00aa; background:rgba(255,0,170,0.1); padding:0.5rem; border-radius:0.5rem;">{{ pwdError }}</p>
          <button @click="changePassword" class="btn-primary" style="margin-top:0.25rem;">🔒 Cambiar Contraseña</button>
        </div>
      </div>
    </div>

    <!-- Session info / activity -->
    <div class="glass-strong" style="border-radius:1.5rem; padding:1.75rem; border:1px solid rgba(255,255,255,0.08);">
      <h3 class="font-display" style="font-size:1rem; font-weight:800; margin-bottom:1.25rem;">📊 Mi Actividad</h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(120px,1fr)); gap:1rem;">
        <div style="text-align:center;">
          <p style="font-size:2.5rem; font-weight:900; color:#00f3ff; line-height:1;">{{ myStats.totalReportes }}</p>
          <p style="font-size:0.65rem; text-transform:uppercase; letter-spacing:0.1em; color:rgba(255,255,255,0.35); font-weight:700; margin-top:0.25rem;">Mis Reportes</p>
        </div>
        <div style="text-align:center;">
          <p style="font-size:2.5rem; font-weight:900; color:#00ff88; line-height:1;">{{ myStats.completados }}</p>
          <p style="font-size:0.65rem; text-transform:uppercase; letter-spacing:0.1em; color:rgba(255,255,255,0.35); font-weight:700; margin-top:0.25rem;">Completados</p>
        </div>
        <div style="text-align:center;">
          <p style="font-size:2.5rem; font-weight:900; color:#ffee00; line-height:1;">{{ myStats.borradores }}</p>
          <p style="font-size:0.65rem; text-transform:uppercase; letter-spacing:0.1em; color:rgba(255,255,255,0.35); font-weight:700; margin-top:0.25rem;">Borradores</p>
        </div>
        <div style="text-align:center;">
          <p style="font-size:2.5rem; font-weight:900; color:#b026ff; line-height:1;">{{ myStats.esteMes }}</p>
          <p style="font-size:0.65rem; text-transform:uppercase; letter-spacing:0.1em; color:rgba(255,255,255,0.35); font-weight:700; margin-top:0.25rem;">Este Mes</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../stores/mainStore'

const store = useMainStore()
const router = useRouter()
const editMode = ref(false)
const pwdError = ref('')

const editForm = reactive({
  name: store.currentUser?.name || '',
  phone: store.currentUser?.phone || '',
  specialty: store.currentUser?.specialty || '',
})

const pwdForm = reactive({ current: '', newPwd: '', confirm: '' })

const profileInfo = computed(() => ({
  Nombre: store.currentUser?.name,
  Email: store.currentUser?.email,
  Cédula: store.currentUser?.cedula,
  Teléfono: store.currentUser?.phone,
  Especialidad: store.currentUser?.specialty,
  Centro: store.currentUser?.center,
  ASIC: store.currentUser?.asic,
}))

const roleBadge = (r) => ({ administrador:'badge-danger', coordinador:'badge-warning', doctor:'badge-info', enfermero:'badge-success' }[r] || 'badge-info')

const myStats = computed(() => {
  const my = store.reports.filter(r => r.createdByUserId === store.currentUser?.id)
  const now = new Date()
  return {
    totalReportes: my.length,
    completados: my.filter(r => r.estado === 'completado').length,
    borradores: my.filter(r => r.estado === 'borrador').length,
    esteMes: my.filter(r => { const d = new Date(r.fecha); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() }).length,
  }
})

function saveProfile() {
  store.updateUser(store.currentUser.id, { name: editForm.name, phone: editForm.phone, specialty: editForm.specialty })
  store.addNotification('Perfil actualizado', 'success')
  editMode.value = false
}

function changePassword() {
  pwdError.value = ''
  if (pwdForm.current !== store.currentUser?.password) { pwdError.value = 'La contraseña actual no es correcta'; return }
  if (pwdForm.newPwd.length < 6) { pwdError.value = 'La nueva contraseña debe tener al menos 6 caracteres'; return }
  if (pwdForm.newPwd !== pwdForm.confirm) { pwdError.value = 'Las contraseñas no coinciden'; return }
  store.updateUser(store.currentUser.id, { password: pwdForm.newPwd })
  store.addNotification('Contraseña cambiada exitosamente', 'success')
  Object.assign(pwdForm, { current: '', newPwd: '', confirm: '' })
}
</script>
