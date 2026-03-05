<template>
  <div style="display:flex; flex-direction:column; gap:1.5rem;" class="animate__animated animate__fadeIn">

    <!-- Header -->
    <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
      <div>
        <h2 class="font-display" style="font-size:1.5rem; font-weight:800;">Jornadas de Salud</h2>
      </div>
      <div style="display:flex; gap:0.75rem;">
        <button v-if="store.canManageJornadas" @click="downloadExcel" class="btn-glass" style="color:#00f3ff; border-color:rgba(0,243,255,0.3);">📥 Descargar Excel</button>
        <button v-if="store.canManageJornadas" @click="showNewModal=true" class="btn-primary">➕ Nueva Jornada</button>
      </div>
    </div>

    <!-- Stats cards -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:1rem;">
      <div v-for="st in statsCards" :key="st.label" class="card-glass">
        <div :style="{width:'44px',height:'44px',borderRadius:'10px',background:st.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.25rem',marginBottom:'0.75rem',boxShadow:'0 4px 20px '+st.glow+'40'}">{{ st.icon }}</div>
        <p style="font-size:2rem; font-weight:900; line-height:1; margin-bottom:0.25rem;" :style="{color:st.color}">{{ st.value }}</p>
        <p style="font-size:0.6rem; text-transform:uppercase; letter-spacing:0.1em; color:rgba(255,255,255,0.35); font-weight:700;">{{ st.label }}</p>
      </div>
    </div>

    <!-- Tabs -->
    <div style="display:flex; gap:0.25rem; background:rgba(255,255,255,0.04); border-radius:1rem; padding:0.3rem; width:fit-content; flex-wrap:wrap;">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab=tab.id"
        :style="{padding:'0.5rem 1.25rem', borderRadius:'0.75rem', border:'none', cursor:'pointer', fontWeight:600, fontSize:'0.8rem', transition:'all 0.3s',
          background: activeTab===tab.id ? 'linear-gradient(135deg,rgba(0,243,255,0.2),rgba(176,38,255,0.15))' : 'transparent',
          color: activeTab===tab.id ? '#00f3ff' : 'rgba(255,255,255,0.5)',
          boxShadow: activeTab===tab.id ? '0 0 20px rgba(0,243,255,0.2)' : 'none'}">
        {{ tab.label }} <span v-if="tab.count !== undefined" style="margin-left:0.3rem; background:rgba(255,255,255,0.1); border-radius:999px; padding:0.1rem 0.4rem; font-size:0.65rem;">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Grid of jornada cards -->
    <div v-if="filteredJornadas.length > 0" style="display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:1.25rem;">
      <div v-for="j in filteredJornadas" :key="j.id" class="card-glass" style="display:flex; flex-direction:column; gap:1rem;">
        <!-- Card header -->
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <span :class="['badge', statusClass(j.estado)]">{{ formatStatus(j.estado) }}</span>
          <div style="display:flex; gap:0.4rem;">
            <div :style="{width:'28px',height:'28px',borderRadius:'6px',background:tipoInfo(j.tipo).bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.875rem'}">{{ tipoInfo(j.tipo).icon }}</div>
          </div>
        </div>
        <!-- Card body -->
        <div>
          <h3 style="font-size:1rem; font-weight:700; margin-bottom:0.5rem; line-height:1.3;">{{ j.nombre }}</h3>
          <div style="display:flex; flex-direction:column; gap:0.3rem;">
            <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.775rem; color:rgba(255,255,255,0.5);">
              <span>📍</span> {{ j.ubicacion }}
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.775rem; color:rgba(255,255,255,0.5);">
              <span>👥</span> {{ j.comunidad }}
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.775rem; color:rgba(255,255,255,0.5);">
              <span>📅</span> {{ j.fecha }}
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.775rem; color:rgba(255,255,255,0.5);">
              <span>👤</span> {{ j.responsableNombre }}
            </div>
          </div>
        </div>
        <!-- Indicadores -->
        <div v-if="Object.keys(j.indicadores).length > 0" style="background:rgba(255,255,255,0.03); border-radius:0.75rem; padding:0.75rem;">
          <p style="font-size:0.55rem; text-transform:uppercase; letter-spacing:0.1em; color:rgba(255,255,255,0.3); font-weight:700; margin-bottom:0.5rem;">Indicadores</p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.3rem;">
            <div v-for="(v,k) in j.indicadores" :key="k" style="display:flex; justify-content:space-between; font-size:0.7rem;">
              <span style="color:rgba(255,255,255,0.4); text-transform:capitalize;">{{ k.replace(/([A-Z])/g,' $1').trim() }}</span>
              <span style="font-weight:700; color:#00f3ff;">{{ v }}</span>
            </div>
          </div>
        </div>
        <!-- Actions -->
        <div style="display:flex; gap:0.5rem; padding-top:0.5rem; border-top:1px solid rgba(255,255,255,0.06);" v-if="store.canManageJornadas">
          <button v-if="j.estado==='programada'" @click="iniciar(j.id)" class="btn-success" style="flex:1; padding:0.5rem; justify-content:center; font-size:0.75rem;">▶ Iniciar</button>
          <button v-if="j.estado==='en_curso'" @click="finalizar(j.id)" class="btn-glass" style="flex:1; padding:0.5rem; justify-content:center; font-size:0.75rem; color:#b026ff; border-color:rgba(176,38,255,0.3);">✓ Finalizar</button>
          <button @click="deleteJornada(j)" style="padding:0.5rem 0.75rem; background:rgba(255,0,170,0.1); border:none; border-radius:0.5rem; color:#ff00aa; cursor:pointer; font-size:0.875rem;">🗑️</button>
        </div>
      </div>
    </div>
    <div v-else style="text-align:center; padding:4rem 2rem; color:rgba(255,255,255,0.3);">
      <div style="font-size:4rem; margin-bottom:1rem;">🗺️</div>
      <p>No hay jornadas en esta categoría</p>
    </div>

    <!-- New Jornada Modal -->
    <div v-if="showNewModal" class="modal-overlay" @click.self="showNewModal=false">
      <div class="glass-strong" style="max-width:600px; width:100%; border-radius:1.5rem; padding:2rem; border:1px solid rgba(255,255,255,0.12); max-height:90vh; overflow-y:auto;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem;">
          <h3 class="font-display" style="font-size:1.25rem; font-weight:800;">🗺️ Nueva Jornada</h3>
          <button @click="showNewModal=false" style="background:none; border:none; color:rgba(255,255,255,0.5); cursor:pointer; font-size:1.25rem;">✕</button>
        </div>
        <div style="display:flex; flex-direction:column; gap:1rem;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div style="grid-column:1/-1;">
              <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Nombre de la Jornada</label>
              <input v-model="newJornada.nombre" type="text" class="input-glass" placeholder="Ej: Jornada de Vacunación Masiva" />
            </div>
            <div>
              <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Tipo</label>
              <select v-model="newJornada.tipo" class="input-glass">
                <option value="despistaje">Despistaje</option>
                <option value="vacunacion">Vacunación</option>
                <option value="amor_en_accion">Amor en Acción</option>
                <option value="integral">Integral</option>
                <option value="charla">Charla</option>
              </select>
            </div>
            <div>
              <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Fecha</label>
              <input v-model="newJornada.fecha" type="date" class="input-glass" />
            </div>
            <div>
              <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Ubicación</label>
              <input v-model="newJornada.ubicacion" type="text" class="input-glass" placeholder="Plaza, Centro, Comunidad" />
            </div>
            <div>
              <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Comunidad</label>
              <input v-model="newJornada.comunidad" type="text" class="input-glass" placeholder="Nombre de la comunidad" />
            </div>
            <div>
              <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">ASIC</label>
              <select v-model="newJornada.asic" class="input-glass">
                <option v-for="a in store.ASIC_LIST" :key="a" :value="a">{{ a }}</option>
              </select>
            </div>
            <div style="grid-column:1/-1;">
              <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Observaciones</label>
              <textarea v-model="newJornada.observaciones" class="input-glass" rows="2" placeholder="Notas adicionales..." style="resize:vertical;" />
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:0.5rem;">
            <button @click="showNewModal=false" class="btn-glass">Cancelar</button>
            <button @click="createJornada" class="btn-primary" :disabled="!newJornada.nombre">🗺️ Crear Jornada</button>
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
const activeTab = ref('todas')
const showNewModal = ref(false)

const newJornada = reactive({ nombre: '', tipo: 'despistaje', fecha: new Date().toISOString().slice(0,10), ubicacion: '', comunidad: '', asic: store.ASIC_LIST[0], observaciones: '' })

const tabs = computed(() => [
  { id: 'todas', label: 'Todas' },
  { id: 'en_curso', label: 'En Curso', count: store.jornadasActivas.length },
  { id: 'programada', label: 'Programadas', count: store.jornadasProgramadas.length },
  { id: 'finalizada', label: 'Finalizadas', count: store.jornadasFinalizadas.length },
])

const filteredJornadas = computed(() => {
  if (activeTab.value === 'todas') return store.jornadas
  return store.jornadas.filter(j => j.estado === activeTab.value)
})

const statsCards = computed(() => [
  { icon: '⚡', label: 'En Curso', value: store.jornadasActivas.length, color: '#00ff88', bg: 'rgba(0,255,136,0.15)', glow: '#00ff88' },
  { icon: '📅', label: 'Programadas', value: store.jornadasProgramadas.length, color: '#00f3ff', bg: 'rgba(0,243,255,0.15)', glow: '#00f3ff' },
  { icon: '✅', label: 'Finalizadas', value: store.jornadasFinalizadas.length, color: '#b026ff', bg: 'rgba(176,38,255,0.15)', glow: '#b026ff' },
  { icon: '🗺️', label: 'Total', value: store.jornadas.length, color: '#ffee00', bg: 'rgba(255,238,0,0.15)', glow: '#ffee00' },
])

const tipoMap = {
  despistaje: { icon: '🔬', bg: 'rgba(0,243,255,0.15)' },
  vacunacion: { icon: '💉', bg: 'rgba(0,255,136,0.15)' },
  amor_en_accion: { icon: '❤️', bg: 'rgba(255,0,170,0.15)' },
  integral: { icon: '🏥', bg: 'rgba(176,38,255,0.15)' },
  charla: { icon: '🎤', bg: 'rgba(255,238,0,0.15)' },
}
const tipoInfo = (tipo) => tipoMap[tipo] || { icon: '🗺️', bg: 'rgba(255,255,255,0.1)' }

const statusClass = (e) => ({ en_curso: 'badge-success', programada: 'badge-info', finalizada: 'badge-purple', cancelada: 'badge-danger' }[e] || 'badge-info')
const formatStatus = (e) => ({ en_curso: 'En Curso', programada: 'Programada', finalizada: 'Finalizada', cancelada: 'Cancelada' }[e] || e)

function iniciar(id) { store.updateJornadaEstado(id, 'en_curso'); store.addNotification('Jornada iniciada', 'success') }
function finalizar(id) { store.updateJornadaEstado(id, 'finalizada'); store.addNotification('Jornada finalizada', 'success') }
function deleteJornada(j) {
  if (confirm(`¿Eliminar la jornada "${j.nombre}"?`)) store.deleteJornada(j.id)
}

function createJornada() {
  store.addJornada({
    nombre: newJornada.nombre, tipo: newJornada.tipo, fecha: newJornada.fecha,
    ubicacion: newJornada.ubicacion, comunidad: newJornada.comunidad, asic: newJornada.asic,
    observaciones: newJornada.observaciones,
    responsableId: store.currentUser?.id,
    responsableNombre: store.currentUser?.name,
    indicadores: {}
  })
  showNewModal.value = false
  Object.assign(newJornada, { nombre: '', tipo: 'despistaje', fecha: new Date().toISOString().slice(0,10), ubicacion: '', comunidad: '', observaciones: '' })
}

function autoFitColumns(XLSX, ws) {
  const range = XLSX.utils.decode_range(ws['!ref'])
  const cols = []
  for (let c = range.s.c; c <= range.e.c; c++) {
    let maxWidth = 10
    for (let r = range.s.r; r <= range.e.r; r++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c })]
      if (cell?.v) maxWidth = Math.max(maxWidth, String(cell.v).length)
    }
    cols.push({ wch: maxWidth + 4 })
  }
  ws['!cols'] = cols
}

function downloadExcel() {
  import('xlsx').then(XLSX => {
    const rows = filteredJornadas.value.map(j => ({
      Jornada: j.nombre,
      Tipo: formatStatus(j.tipo),
      Fecha: j.fecha,
      Ubicación: j.ubicacion,
      Comunidad: j.comunidad,
      ASIC: j.asic,
      Responsable: j.responsableNombre,
      Estado: formatStatus(j.estado),
      ...Object.fromEntries(Object.entries(j.indicadores || {}).map(([k,v]) => [k.replace(/([A-Z])/g,' $1').trim(), v]))
    }))
    
    if (rows.length === 0) {
      store.addNotification('No hay jornadas para exportar', 'warning')
      return
    }

    const ws = XLSX.utils.json_to_sheet(rows)
    autoFitColumns(XLSX, ws)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Jornadas')
    XLSX.writeFile(wb, `Reporte_Jornadas_${new Date().toISOString().slice(0,10)}.xlsx`)
    store.addNotification('Excel de Jornadas descargado exitosamente', 'success')
  })
}
</script>
