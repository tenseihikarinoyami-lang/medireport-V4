<template>
  <div style="min-height:100vh; background:#0a0a0f; display:flex; align-items:center; justify-content:center; padding:2rem; position:relative; overflow:hidden;">
    <!-- Background effects -->
    <div style="position:absolute; top:20%; left:20%; width:500px; height:500px; background:rgba(0,243,255,0.08); border-radius:50%; filter:blur(120px);" class="animate-pulse-slow" />
    <div style="position:absolute; bottom:20%; right:20%; width:400px; height:400px; background:rgba(176,38,255,0.08); border-radius:50%; filter:blur(100px);" class="animate-pulse-slow" />

    <div style="position:relative; width:100%; max-width:440px; z-index:10;" class="animate__animated animate__fadeInUp">
      <!-- Logo card -->
      <div style="text-align:center; margin-bottom:2rem;">
        <div style="width:80px; height:80px; margin:0 auto 1rem; border-radius:20px; background:linear-gradient(135deg,#00f3ff,#b026ff); display:flex; align-items:center; justify-content:center; font-size:2rem; box-shadow:0 0 40px rgba(0,243,255,0.3);" class="animate-pulse-glow">🏥</div>
        <h1 class="font-display" style="font-size:1.75rem; font-weight:900; background:linear-gradient(135deg,#00f3ff,#b026ff,#ff00aa); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">MediReport Pro</h1>
        <p style="color:rgba(255,255,255,0.4); font-size:0.8rem; margin-top:0.25rem; text-transform:uppercase; letter-spacing:0.1em;">Municipio Santiago Mariño</p>
      </div>

      <!-- ==================== LOGIN FORM ==================== -->
      <div v-if="step === 'login'" class="glass-strong" style="border-radius:1.5rem; padding:2rem; border:1px solid rgba(255,255,255,0.1);">
        <h2 style="font-size:1.25rem; font-weight:700; text-align:center; margin-bottom:1.75rem;">Iniciar Sesión</h2>

        <form @submit.prevent="handleLogin" style="display:flex; flex-direction:column; gap:1.25rem;">
          <div>
            <label style="display:block; font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.5); margin-bottom:0.5rem;">Correo Electrónico</label>
            <div style="position:relative;">
              <span style="position:absolute; left:1rem; top:50%; transform:translateY(-50%); font-size:1rem;">👤</span>
              <input v-model="form.email" type="text" required placeholder="usuario o correo" class="input-glass" style="padding-left:2.75rem;" :disabled="loading" />
            </div>
          </div>
          <div>
            <label style="display:block; font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.5); margin-bottom:0.5rem;">Contraseña</label>
            <div style="position:relative;">
              <span style="position:absolute; left:1rem; top:50%; transform:translateY(-50%); font-size:1rem;">🔒</span>
              <input v-model="form.password" :type="showPwd ? 'text' : 'password'" required placeholder="••••••••" class="input-glass" style="padding-left:2.75rem; padding-right:3rem;" :disabled="loading" />
              <button type="button" @click="showPwd=!showPwd" style="position:absolute; right:1rem; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.4); font-size:1rem;" :title="showPwd ? 'Ocultar' : 'Mostrar'">{{ showPwd ? '🙈' : '👁️' }}</button>
            </div>
          </div>
          <p v-if="error" style="color:#ff00aa; font-size:0.8rem; text-align:center; background:rgba(255,0,170,0.1); padding:0.5rem; border-radius:0.5rem; border:1px solid rgba(255,0,170,0.2);">{{ error }}</p>
          <button type="submit" class="btn-primary" :disabled="loading" style="width:100%; padding:0.875rem; justify-content:center; font-size:1rem; margin-top:0.5rem;">
            <span v-if="loading" class="animate-spin-slow" style="display:inline-block;">⏳</span>
            <span v-else>🚀</span>
            {{ loading ? 'Autenticando...' : 'Acceder al Sistema' }}
          </button>
        </form>

        <!-- Demo credentials -->
        <div style="margin-top:1.5rem; text-align:center;">
          <button @click="showDemo = !showDemo" style="background:none; border:none; color:rgba(255,255,255,0.3); font-size:0.7rem; cursor:pointer; text-decoration:underline;">Solo Administradores: Usuarios de Prueba</button>
        </div>
        <div v-if="showDemo" style="margin-top:1rem; padding:1rem; background:rgba(0,243,255,0.05); border:1px solid rgba(0,243,255,0.15); border-radius:0.75rem;" class="animate__animated animate__fadeIn">
          <p style="font-size:0.7rem; color:rgba(255,255,255,0.4); text-align:center; margin-bottom:0.75rem; text-transform:uppercase; letter-spacing:0.08em;">Credenciales de Prueba</p>
          <div style="display:flex; flex-direction:column; gap:0.35rem;">
            <div v-for="c in demoCredentials" :key="c.role" @click="fillDemo(c)" style="display:flex; align-items:center; justify-content:space-between; cursor:pointer; padding:0.4rem 0.75rem; border-radius:0.5rem; font-size:0.75rem; transition:background 0.2s;" class="demo-credential-row">
              <span style="color:#00f3ff; font-weight:600;">{{ c.role }}</span>
              <span style="color:rgba(255,255,255,0.5); font-family:monospace;">{{ c.email }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== CAMBIAR CLAVE TEMPORAL ==================== -->
      <div v-else-if="step === 'change_password'" class="glass-strong animate__animated animate__fadeIn" style="border-radius:1.5rem; padding:2rem; border:1px solid rgba(255,255,255,0.1);">
        <div style="text-align:center; margin-bottom:1.5rem;">
          <div style="font-size:2.5rem; margin-bottom:0.5rem;">🔐</div>
          <h2 style="font-size:1.25rem; font-weight:700;">Cambiar Clave Temporal</h2>
          <p style="color:rgba(255,255,255,0.4); font-size:0.8rem; margin-top:0.25rem;">Tu cuenta requiere una nueva contraseña</p>
        </div>
        <form @submit.prevent="submitNewPassword" style="display:flex; flex-direction:column; gap:1rem;">
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Nueva Contraseña</label>
            <input v-model="newPwdForm.newPwd" type="password" required class="input-glass" placeholder="Mínimo 6 caracteres" />
          </div>
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Confirmar Contraseña</label>
            <input v-model="newPwdForm.confirm" type="password" required class="input-glass" placeholder="Repetir contraseña" />
          </div>
          <p v-if="pwdError" style="color:#ff00aa; font-size:0.8rem; background:rgba(255,0,170,0.1); padding:0.5rem; border-radius:0.5rem;">{{ pwdError }}</p>
          <button type="submit" class="btn-primary" style="width:100%; padding:0.875rem; justify-content:center; font-size:1rem;">🔑 Establecer Nueva Contraseña</button>
        </form>
      </div>

      <!-- ==================== COMPLETAR DATOS PERSONALES ==================== -->
      <div v-else-if="step === 'setup_profile'" class="glass-strong animate__animated animate__fadeIn" style="border-radius:1.5rem; padding:2rem; border:1px solid rgba(255,255,255,0.1);">
        <div style="text-align:center; margin-bottom:1.5rem;">
          <div style="font-size:2.5rem; margin-bottom:0.5rem;">📋</div>
          <h2 style="font-size:1.25rem; font-weight:700;">Completa tu Perfil</h2>
          <p style="color:rgba(255,255,255,0.4); font-size:0.8rem; margin-top:0.25rem;">Estos datos se usarán en tus reportes</p>
        </div>
        <form @submit.prevent="submitProfile" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
          <div style="grid-column:1/-1;">
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Nombre Completo</label>
            <input v-model="profileForm.name" type="text" required class="input-glass" placeholder="Dr./Enf. Nombre Apellido" />
          </div>
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Cédula</label>
            <input v-model="profileForm.cedula" type="text" class="input-glass" placeholder="V-12345678" />
          </div>
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Teléfono</label>
            <input v-model="profileForm.phone" type="text" class="input-glass" placeholder="+58 412-1234567" />
          </div>
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Especialidad</label>
            <input v-model="profileForm.specialty" type="text" class="input-glass" placeholder="Medicina General..." />
          </div>
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Centro de Salud</label>
            <select v-model="profileForm.center" class="input-glass">
              <option v-for="c in store.CENTROS_SALUD" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div style="grid-column:1/-1;">
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">ASIC</label>
            <select v-model="profileForm.asic" class="input-glass">
              <option v-for="a in store.ASIC_LIST" :key="a" :value="a">{{ a }}</option>
            </select>
          </div>
          <div style="grid-column:1/-1;">
            <button type="submit" class="btn-primary" style="width:100%; padding:0.875rem; justify-content:center; font-size:1rem;">✅ Completar y Acceder al Sistema</button>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <p style="text-align:center; margin-top:1.5rem; font-size:0.7rem; color:rgba(255,255,255,0.25);">© 2025 Alcaldía de Santiago Mariño · Gente Que Resuelve</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore, CENTROS_SALUD, ASIC_LIST } from '../stores/mainStore'

const store = useMainStore()
const router = useRouter()

const step = ref('login') // 'login' | 'change_password' | 'setup_profile'
const loading = ref(false)
const showPwd = ref(false)
const showDemo = ref(false)
const error = ref('')
const pwdError = ref('')
const form = reactive({ email: '', password: '' })
const newPwdForm = reactive({ newPwd: '', confirm: '' })
const profileForm = reactive({
  name: '', cedula: '', phone: '', specialty: '',
  center: store.CENTROS_SALUD?.[0] || '',
  asic: store.ASIC_LIST?.[0] || ''
})

const demoCredentials = [
  { role: 'Administrador Principal', email: 'admin', pwd: 'admin123' },
  { role: 'Coordinador ASICs', email: 'maria.gonzalez@hospital.com', pwd: 'coord123' },
  { role: 'Doctor Básico', email: 'carlos.rodriguez@cdi.com', pwd: 'doctor123' },
]

function fillDemo(c) {
  form.email = c.email
  form.password = c.pwd
}

async function handleLogin() {
  error.value = ''
  loading.value = true
  const ok = await store.login(form.email, form.password)
  loading.value = false
  if (ok === 'change_password') {
    // Usuario con clave temporal → flujo de primer inicio
    step.value = 'change_password'
  } else if (ok === true) {
    store.addNotification('¡Bienvenido al sistema!', 'success')
    router.push('/app/dashboard')
  } else {
    error.value = 'Credenciales incorrectas. Intente de nuevo.'
  }
}

function submitNewPassword() {
  pwdError.value = ''
  if (newPwdForm.newPwd.length < 6) { pwdError.value = 'La contraseña debe tener al menos 6 caracteres'; return }
  if (newPwdForm.newPwd !== newPwdForm.confirm) { pwdError.value = 'Las contraseñas no coinciden'; return }
  // Actualizar la contraseña y quitar el flag
  store.updateUser(store.currentUser.id, { password: newPwdForm.newPwd, mustChangePassword: false })
  // Actualizar la sesión con los datos nuevos
  store.currentUser.password = newPwdForm.newPwd
  store.currentUser.mustChangePassword = false
  localStorage.setItem('v4_current_user', JSON.stringify(store.currentUser))
  step.value = 'setup_profile'
}

function submitProfile() {
  const updates = {
    name: profileForm.name || store.currentUser.email,
    cedula: profileForm.cedula,
    phone: profileForm.phone,
    specialty: profileForm.specialty,
    center: profileForm.center,
    asic: profileForm.asic,
  }
  store.updateUser(store.currentUser.id, updates)
  // Actualizar sesión local
  Object.assign(store.currentUser, updates)
  localStorage.setItem('v4_current_user', JSON.stringify(store.currentUser))
  store.addNotification('¡Bienvenido al sistema! Tu perfil ha sido configurado.', 'success')
  router.push('/app/dashboard')
}
</script>

<style scoped>
.demo-credential-row:hover { background: rgba(0,243,255,0.08); }
</style>
