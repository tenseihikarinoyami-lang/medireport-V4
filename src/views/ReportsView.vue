<template>
  <div style="display:flex; flex-direction:column; gap:1.5rem;" class="animate__animated animate__fadeIn">

    <!-- Header -->
    <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
      <div>
        <h2 class="font-display" style="font-size:1.5rem; font-weight:800;">Reportes Médicos</h2>
        <p style="color:rgba(255,255,255,0.4); font-size:0.8rem; margin-top:0.2rem;">Gestión de morbilidad, mortalidad, CDI y más</p>
      </div>
      <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
        <button v-if="store.canDownloadReports" @click="downloadAll" class="btn-glass" title="Solo admin y coordinador">📥 Descargar Todo</button>
        <router-link to="/app/reportes/nuevo" class="btn-primary">📝 Nuevo Reporte</router-link>
      </div>
    </div>

    <!-- Stats (only admin/coord) -->
    <div v-if="store.canViewTotals" style="display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:1rem;">
      <div v-for="s in totalsStats" :key="s.label" class="card-glass" style="padding:1rem;">
        <p style="font-size:0.65rem; text-transform:uppercase; letter-spacing:0.1em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.5rem;">{{ s.label }}</p>
        <p style="font-size:2rem; font-weight:900;" :style="{color:s.color}">{{ s.value }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="glass-strong" style="border-radius:1.25rem; padding:1.25rem; border:1px solid rgba(255,255,255,0.08);">
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:1rem;">
        <div>
          <label style="font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; display:block; margin-bottom:0.4rem;">Tipo</label>
          <select v-model="filters.tipo" class="input-glass" style="padding:0.6rem 0.85rem;">
            <option value="">Todos</option>
            <option value="morbilidad">Morbilidad</option>
            <option value="mortalidad">Mortalidad</option>
            <option value="cdi">CDI</option>
            <option value="accion_comunal">Acción Comunal</option>
            <option value="especialidad">Especialidad</option>
          </select>
        </div>
        <div>
          <label style="font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; display:block; margin-bottom:0.4rem;">Desde</label>
          <input v-model="filters.fechaDesde" type="date" class="input-glass" style="padding:0.6rem 0.85rem;" />
        </div>
        <div>
          <label style="font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; display:block; margin-bottom:0.4rem;">Hasta</label>
          <input v-model="filters.fechaHasta" type="date" class="input-glass" style="padding:0.6rem 0.85rem;" />
        </div>
        <div>
          <label style="font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; display:block; margin-bottom:0.4rem;">ASIC</label>
          <select v-model="filters.asic" class="input-glass" style="padding:0.6rem 0.85rem;">
            <option value="">Todos</option>
            <option v-for="a in store.ASIC_LIST" :key="a" :value="a">{{ a }}</option>
          </select>
        </div>
        <div>
          <label style="font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; display:block; margin-bottom:0.4rem;">Estado</label>
          <select v-model="filters.estado" class="input-glass" style="padding:0.6rem 0.85rem;">
            <option value="">Todos</option>
            <option value="completado">Completado</option>
            <option value="borrador">Borrador</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="glass-strong" style="border-radius:1.5rem; border:1px solid rgba(255,255,255,0.08); overflow:hidden;">
      <div style="overflow-x:auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Sem. Epid.</th>
              <th>Personal</th>
              <th>Centro de Salud</th>
              <th>ASIC</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in filteredReports" :key="r.id">
              <td>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <div :style="{width:'28px',height:'28px',borderRadius:'6px',background:typeInfo(r.tipo).bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.875rem'}">{{ typeInfo(r.tipo).icon }}</div>
                  <span style="font-size:0.8rem; font-weight:600; text-transform:capitalize;">{{ typeInfo(r.tipo).label }}</span>
                </div>
              </td>
              <td style="color:rgba(255,255,255,0.6); font-size:0.8rem;">{{ r.fecha }}</td>
              <td style="color:rgba(255,255,255,0.6); font-size:0.8rem;">Sem. {{ r.semana }}</td>
              <td style="color:rgba(255,255,255,0.7); font-size:0.8rem;">{{ r.createdByName }}</td>
              <td style="color:rgba(255,255,255,0.7); font-size:0.8rem;">{{ r.centroSalud }}</td>
              <td style="font-size:0.7rem; color:rgba(255,255,255,0.5);">{{ r.asic }}</td>
              <td><span :class="['badge', r.estado === 'completado' ? 'badge-success' : 'badge-warning']">{{ r.estado }}</span></td>
              <td>
                <div style="display:flex; gap:0.4rem;">
                  <button @click="viewReport(r)" style="padding:0.4rem 0.6rem; background:rgba(255,255,255,0.05); border:none; border-radius:6px; color:rgba(255,255,255,0.7); cursor:pointer; font-size:0.8rem; transition:all 0.2s;" title="Ver">👁️</button>
                  <button v-if="store.canDownloadReports" @click="downloadSingle(r)" style="padding:0.4rem 0.6rem; background:rgba(0,255,136,0.1); border:none; border-radius:6px; color:#00ff88; cursor:pointer; font-size:0.8rem; transition:all 0.2s;" title="Descargar Excel">📥</button>
                  <button v-if="canDeleteReport(r)" @click="deleteReport(r)" style="padding:0.4rem 0.6rem; background:rgba(255,0,170,0.1); border:none; border-radius:6px; color:#ff00aa; cursor:pointer; font-size:0.8rem; transition:all 0.2s;" title="Eliminar">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="filteredReports.length === 0" style="padding:3rem; text-align:center; color:rgba(255,255,255,0.3);">
        <div style="font-size:3rem; margin-bottom:1rem;">📭</div>
        <p style="font-size:0.875rem;">No se encontraron reportes</p>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="viewingReport" class="modal-overlay" @click.self="viewingReport=null">
      <div class="glass-strong" style="max-width:600px; width:100%; border-radius:1.5rem; padding:2rem; border:1px solid rgba(255,255,255,0.1);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem;">
          <h3 class="font-display" style="font-size:1.25rem; font-weight:800;">{{ typeInfo(viewingReport.tipo).label }}</h3>
          <button @click="viewingReport=null" style="background:none; border:none; color:rgba(255,255,255,0.5); cursor:pointer; font-size:1.25rem;">✕</button>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1.25rem;">
          <div v-for="(val, key) in {Fecha: viewingReport.fecha, 'Semana': 'Sem. '+viewingReport.semana, Centro: viewingReport.centroSalud, ASIC: viewingReport.asic, Personal: viewingReport.createdByName, Estado: viewingReport.estado}" :key="key" style="padding:0.75rem; background:rgba(255,255,255,0.04); border-radius:0.75rem;">
            <p style="font-size:0.6rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); margin-bottom:0.25rem;">{{ key }}</p>
            <p style="font-size:0.875rem; font-weight:600;">{{ val }}</p>
          </div>
        </div>
        <h4 style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; color:rgba(255,255,255,0.4); margin-bottom:0.75rem;">Indicadores</h4>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
          <div v-for="(val, key) in viewingReport.datos" :key="key" style="display:flex; justify-content:space-between; padding:0.5rem 0.75rem; background:rgba(255,255,255,0.03); border-radius:0.5rem;">
            <span style="font-size:0.75rem; color:rgba(255,255,255,0.5); text-transform:capitalize;">{{ key.replace(/([A-Z])/g,' $1').trim() }}</span>
            <span style="font-size:0.875rem; font-weight:700; color:#00f3ff;">{{ val }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useMainStore } from '../stores/mainStore'
import { formatDate } from '../stores/mainStore'

const store = useMainStore()
const viewingReport = ref(null)

const filters = reactive({ tipo: '', fechaDesde: '', fechaHasta: '', asic: '', estado: '' })

const typeMap = {
  morbilidad: { label: 'Morbilidad', icon: '📋', bg: 'rgba(0,243,255,0.15)' },
  mortalidad: { label: 'Mortalidad', icon: '💀', bg: 'rgba(255,0,170,0.15)' },
  cdi: { label: 'CDI', icon: '🏥', bg: 'rgba(176,38,255,0.15)' },
  accion_comunal: { label: 'Acción Comunal', icon: '🤝', bg: 'rgba(0,255,136,0.15)' },
  especialidad: { label: 'Especialidad', icon: '⭐', bg: 'rgba(255,238,0,0.15)' },
}
const typeInfo = (tipo) => typeMap[tipo] || { label: tipo, icon: '📄', bg: 'rgba(255,255,255,0.1)' }

const filteredReports = computed(() => {
  return store.getMyReports.filter(r => {
    if (filters.tipo && r.tipo !== filters.tipo) return false
    if (filters.asic && r.asic !== filters.asic) return false
    if (filters.estado && r.estado !== filters.estado) return false
    if (filters.fechaDesde && r.fecha < filters.fechaDesde) return false
    if (filters.fechaHasta && r.fecha > filters.fechaHasta) return false
    return true
  })
})

const totalsStats = computed(() => [
  { label: 'Total Reportes', value: store.reports.length, color: '#00f3ff' },
  { label: 'Reportes Hoy', value: store.reports.filter(r => r.fecha === new Date().toISOString().slice(0,10)).length, color: '#00ff88' },
  { label: 'Pendientes', value: store.reports.filter(r => r.estado === 'borrador').length, color: '#ffee00' },
  { label: 'ASICs Activos', value: new Set(store.reports.map(r => r.asic)).size, color: '#b026ff' },
])

const canDeleteReport = (r) => store.isAdmin || (r.createdByUserId === store.currentUser?.id && r.estado === 'borrador')

function viewReport(r) { viewingReport.value = r }
function deleteReport(r) {
  if (confirm(`¿Eliminar el reporte "${typeInfo(r.tipo).label}" del ${r.fecha}?`)) {
    store.deleteReport(r.id)
  }
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

function downloadSingle(report) {
  import('xlsx').then(XLSX => {
    const header = [['Campo', 'Valor']]
    const meta = [['Tipo', typeInfo(report.tipo).label], ['Fecha', report.fecha], ['Semana Epidemiológica', 'Sem. '+report.semana], ['Centro de Salud', report.centroSalud], ['ASIC', report.asic], ['Responsable', report.createdByName], ['Estado', report.estado]]
    const indicadores = Object.entries(report.datos).map(([k,v]) => [k.replace(/([A-Z])/g,' $1').trim(), v])
    const data = [...header, ...meta, ['─','─'], ['INDICADORES',''], ...indicadores]
    const ws = XLSX.utils.aoa_to_sheet(data)
    autoFitColumns(XLSX, ws)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte')
    XLSX.writeFile(wb, `Reporte_${report.tipo}_${report.fecha}.xlsx`)
    store.addNotification('Reporte descargado en Excel', 'success')
  })
}

function downloadAll() {
  import('xlsx').then(XLSX => {
    const rows = filteredReports.value.map(r => ({
      Tipo: typeInfo(r.tipo).label, Fecha: r.fecha, 'Semana Epid.': r.semana,
      Responsable: r.createdByName, 'Centro de Salud': r.centroSalud, ASIC: r.asic, Estado: r.estado,
      ...Object.fromEntries(Object.entries(r.datos).map(([k,v]) => [k.replace(/([A-Z])/g,' $1').trim(), v]))
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    autoFitColumns(XLSX, ws)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Consolidado')
    XLSX.writeFile(wb, `Consolidado_Reportes_${new Date().toISOString().slice(0,10)}.xlsx`)
    store.addNotification('Consolidado descargado exitosamente', 'success')
  })
}
</script>
