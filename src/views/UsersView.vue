<template>
  <div style="display:flex; flex-direction:column; gap:1.5rem;" class="animate__animated animate__fadeIn">

    <!-- Header -->
    <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
      <div>
        <h2 class="font-display" style="font-size:1.5rem; font-weight:800;">Gestión de Usuarios</h2>
        <p style="color:rgba(255,255,255,0.4); font-size:0.8rem;">Personal médico del municipio</p>
      </div>
      <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
        <div style="position:relative;">
          <span style="position:absolute; left:0.75rem; top:50%; transform:translateY(-50%); font-size:0.875rem;">🔍</span>
          <input v-model="search" type="text" class="input-glass" placeholder="Buscar usuario..." style="padding-left:2.5rem; padding-top:0.6rem; padding-bottom:0.6rem;" />
        </div>
        <select v-model="roleFilter" class="input-glass" style="padding:0.6rem 0.85rem; width:auto;">
          <option value="">Todos los roles</option>
          <option value="administrador">Administrador</option>
          <option value="coordinador">Coordinador</option>
          <option value="doctor">Doctor</option>
          <option value="enfermero">Enfermero</option>
        </select>
        <button v-if="store.canManageUsers" @click="showAddModal=true" class="btn-primary">➕ Nuevo Usuario</button>
      </div>
    </div>

    <!-- Stats -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:1rem;">
      <div v-for="s in userStats" :key="s.label" class="card-glass">
        <p style="font-size:0.65rem; text-transform:uppercase; letter-spacing:0.1em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.5rem;">{{ s.label }}</p>
        <p style="font-size:2rem; font-weight:900;" :style="{color:s.color}">{{ s.value }}</p>
      </div>
    </div>

    <!-- Users table -->
    <div class="glass-strong" style="border-radius:1.5rem; border:1px solid rgba(255,255,255,0.08); overflow:hidden;">
      <div style="overflow-x:auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Especialidad</th>
              <th>Centro / ASIC</th>
              <th>Cédula / Email</th>
              <th>Estado</th>
              <th v-if="store.canManageUsers">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in filteredUsers" :key="u.id">
              <td>
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <div style="width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,rgba(176,38,255,0.3),rgba(0,243,255,0.2)); display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0;">{{ u.avatar }}</div>
                  <div>
                    <p style="font-size:0.85rem; font-weight:600;">{{ u.name }}</p>
                    <p style="font-size:0.65rem; color:rgba(255,255,255,0.4);">{{ u.phone }}</p>
                  </div>
                </div>
              </td>
              <td><span :class="['badge', roleBadge(u.role)]" style="text-transform:capitalize;">{{ u.role }}</span></td>
              <td style="font-size:0.8rem; color:rgba(255,255,255,0.7);">{{ u.specialty }}</td>
              <td>
                <div>
                  <p style="font-size:0.8rem; font-weight:500;">{{ u.center }}</p>
                  <p style="font-size:0.65rem; color:rgba(255,255,255,0.4);">{{ u.asic }}</p>
                </div>
              </td>
              <td>
                <div>
                  <p style="font-size:0.75rem; font-family:monospace;">{{ u.cedula }}</p>
                  <p style="font-size:0.65rem; color:rgba(255,255,255,0.4);">{{ u.email }}</p>
                </div>
              </td>
              <td>
                <span :class="['badge', u.isActive ? 'badge-success' : 'badge-danger']">{{ u.isActive ? 'Activo' : 'Inactivo' }}</span>
              </td>
              <td v-if="store.canManageUsers">
                <div style="display:flex; gap:0.4rem;">
                  <button @click="contactWA(u)" style="padding:0.4rem 0.6rem; background:rgba(0,255,136,0.1); border:none; border-radius:6px; color:#00ff88; cursor:pointer; font-size:0.875rem; transition:all 0.2s;" title="WhatsApp">💬</button>
                  <button @click="editUser(u)" style="padding:0.4rem 0.6rem; background:rgba(0,243,255,0.1); border:none; border-radius:6px; color:#00f3ff; cursor:pointer; font-size:0.875rem; transition:all 0.2s;" title="Editar">✏️</button>
                  <button v-if="u.id !== store.currentUser?.id" @click="deleteUser(u)" style="padding:0.4rem 0.6rem; background:rgba(255,0,170,0.1); border:none; border-radius:6px; color:#ff00aa; cursor:pointer; font-size:0.875rem; transition:all 0.2s;" title="Eliminar">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="filteredUsers.length === 0" style="padding:3rem; text-align:center; color:rgba(255,255,255,0.3);">
        <div style="font-size:3rem; margin-bottom:1rem;">👥</div>
        <p>No se encontraron usuarios</p>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal=false">
      <div class="glass-strong" style="max-width:480px; width:100%; border-radius:1.5rem; padding:2rem; border:1px solid rgba(255,255,255,0.12); max-height:90vh; overflow-y:auto;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem;">
          <h3 class="font-display" style="font-size:1.25rem; font-weight:800;">{{ editingUser ? '✏️ Editar Usuario' : '➕ Nuevo Usuario' }}</h3>
          <button @click="closeModal" style="background:none; border:none; color:rgba(255,255,255,0.5); cursor:pointer; font-size:1.25rem;">✕</button>
        </div>

        <!-- MODO EDICIÓN: formulario completo -->
        <div v-if="editingUser" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Nombre</label>
            <input v-model="userForm.name" type="text" class="input-glass" placeholder="Dr./Enf. Juan..." />
          </div>
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Rol</label>
            <select v-model="userForm.role" class="input-glass">
              <option v-for="r in allowedRoles" :key="r.value" :value="r.value">{{ r.label }}</option>
            </select>
          </div>
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Email / Usuario</label>
            <input v-model="userForm.email" type="text" class="input-glass" placeholder="usuario" />
          </div>
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Cédula</label>
            <input v-model="userForm.cedula" type="text" class="input-glass" placeholder="V-12345678" />
          </div>
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Teléfono</label>
            <input v-model="userForm.phone" type="text" class="input-glass" placeholder="+58 412-1234567" />
          </div>
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Especialidad</label>
            <input v-model="userForm.specialty" type="text" class="input-glass" placeholder="Medicina General..." />
          </div>
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Centro de Salud</label>
            <select v-model="userForm.center" class="input-glass">
              <option v-for="c in store.CENTROS_SALUD" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">ASIC</label>
            <select v-model="userForm.asic" class="input-glass">
              <option v-for="a in store.ASIC_LIST" :key="a" :value="a">{{ a }}</option>
            </select>
          </div>
        </div>

        <!-- MODO CREACIÓN: formulario simplificado -->
        <div v-else style="display:flex; flex-direction:column; gap:1rem;">
          <p style="font-size:0.8rem; color:rgba(255,255,255,0.5); background:rgba(0,243,255,0.06); padding:0.75rem; border-radius:0.75rem; border:1px solid rgba(0,243,255,0.15);">
            💡 El usuario recibirá una clave temporal. Al iniciar sesión por primera vez, deberá cambiarla y completar sus datos personales.
          </p>
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Nombre de Usuario</label>
            <input v-model="userForm.email" type="text" class="input-glass" placeholder="ej: dr.perez" />
          </div>
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Clave Temporal</label>
            <input v-model="userForm.password" type="text" class="input-glass" placeholder="Clave que el usuario cambiará al ingresar" />
          </div>
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Rol</label>
            <select v-model="userForm.role" class="input-glass">
              <option v-for="r in allowedRoles" :key="r.value" :value="r.value">{{ r.label }}</option>
            </select>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.5rem;">
          <button @click="closeModal" class="btn-glass">Cancelar</button>
          <button @click="saveUser" class="btn-primary">{{ editingUser ? '💾 Guardar' : '➕ Crear Usuario' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useMainStore } from '../stores/mainStore'

const store = useMainStore()
const search = ref('')
const roleFilter = ref('')
const showAddModal = ref(false)
const editingUser = ref(null)

const userForm = reactive({ name:'', email:'', password:'', role:'doctor', cedula:'', phone:'', specialty:'', center: store.CENTROS_SALUD[0], asic: store.ASIC_LIST[0], avatar:'👨‍⚕️' })

// Roles permitidos según el rol del usuario actual
const allowedRoles = computed(() => {
  const all = [
    { value: 'administrador', label: 'Administrador' },
    { value: 'coordinador', label: 'Coordinador' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'enfermero', label: 'Enfermero' },
  ]
  if (store.currentUser?.role === 'coordinador') {
    return all.filter(r => r.value === 'doctor' || r.value === 'enfermero')
  }
  return all // admin puede crear todos
})

const filteredUsers = computed(() =>
  store.users.filter(u => {
    const q = search.value.toLowerCase()
    const matches = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.cedula?.toLowerCase().includes(q)
    const roleOk = !roleFilter.value || u.role === roleFilter.value
    return matches && roleOk
  })
)

const userStats = computed(() => {
  const counts = { administrador: 0, coordinador: 0, doctor: 0, enfermero: 0 }
  store.users.forEach(u => { if (counts[u.role] !== undefined) counts[u.role]++ })
  return [
    { label: 'Total Personal', value: store.users.length, color: '#00f3ff' },
    { label: 'Médicos', value: counts.doctor, color: '#b026ff' },
    { label: 'Enfermería', value: counts.enfermero, color: '#00ff88' },
    { label: 'Coordinación', value: counts.coordinador + counts.administrador, color: '#ffee00' },
  ]
})

const roleBadge = (r) => ({ administrador:'badge-danger', coordinador:'badge-warning', doctor:'badge-info', enfermero:'badge-success' }[r] || 'badge-info')

function editUser(u) {
  editingUser.value = u
  Object.assign(userForm, { name:u.name, email:u.email, password:u.password, role:u.role, cedula:u.cedula||'', phone:u.phone||'', specialty:u.specialty||'', center:u.center||store.CENTROS_SALUD[0], asic:u.asic||store.ASIC_LIST[0], avatar:u.avatar||'👤' })
  showAddModal.value = true
}

function closeModal() { showAddModal.value = false; editingUser.value = null }

function saveUser() {
  if (!editingUser.value && (!userForm.email || !userForm.password)) {
    store.addNotification('Nombre de usuario y clave son obligatorios', 'warning')
    return
  }
  if (editingUser.value) {
    store.updateUser(editingUser.value.id, { ...userForm })
    store.addNotification('Usuario actualizado exitosamente', 'success')
  } else {
    // Creación simplificada con clave temporal
    store.addUser({
      name: userForm.email, // nombre temporal = username
      email: userForm.email,
      password: userForm.password,
      role: userForm.role,
      mustChangePassword: true,
      avatar: { administrador: '🛡️', coordinador: '👩‍⚕️', doctor: '👨‍⚕️', enfermero: '💉' }[userForm.role] || '👤'
    })
  }
  closeModal()
  Object.assign(userForm, { name:'', email:'', password:'', role:'doctor', cedula:'', phone:'', specialty:'', center:store.CENTROS_SALUD[0], asic:store.ASIC_LIST[0], avatar:'👤' })
}

function deleteUser(u) {
  if (confirm(`¿Eliminar al usuario "${u.name}"?`)) store.deleteUser(u.id)
}

function contactWA(u) {
  const msg = `Estimado/a ${u.name}, le recordamos que debe enviar su reporte médico de hoy. MediReport Pro - Alcaldía Santiago Mariño.`
  store.contactViaWhatsApp(u.phone, msg)
}
</script>
