<template>
  <div style="display:flex; flex-direction:column; gap:1.5rem;" class="animate__animated animate__fadeIn">

    <!-- Header -->
    <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
      <div>
        <h2 class="font-display" style="font-size:1.5rem; font-weight:800;">Seguimiento Diario</h2>
      </div>
      <div style="display:flex; gap:0.75rem;">
        <button @click="downloadExcel" class="btn-glass" style="color:#00f3ff; border-color:rgba(0,243,255,0.3);">📥 Descargar Excel</button>
        <button @click="remindAll" class="btn-glass">💬 Recordatorio Masivo</button>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="glass-strong" style="border-radius:1.25rem; padding:1.5rem; border:1px solid rgba(255,255,255,0.08);">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
        <div>
          <p style="font-size:0.85rem; font-weight:700;">Progreso del Día</p>
          <p style="font-size:0.7rem; color:rgba(255,255,255,0.4);">{{ reported }} de {{ total }} miembros han reportado</p>
        </div>
        <div style="text-align:right;">
          <p style="font-size:2.5rem; font-weight:900; color:#00ff88; line-height:1;">{{ progressPct }}%</p>
          <p style="font-size:0.65rem; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:0.1em;">Completado</p>
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{width: progressPct+'%'}" />
      </div>
    </div>

    <!-- Stats -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:1rem;">
      <div class="card-glass">
        <p style="font-size:0.65rem; text-transform:uppercase; letter-spacing:0.1em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.5rem;">Total Personal</p>
        <p style="font-size:2rem; font-weight:900; color:#00f3ff;">{{ total }}</p>
      </div>
      <div class="card-glass">
        <p style="font-size:0.65rem; text-transform:uppercase; letter-spacing:0.1em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.5rem;">Reportaron</p>
        <p style="font-size:2rem; font-weight:900; color:#00ff88;">{{ reported }}</p>
      </div>
      <div class="card-glass">
        <p style="font-size:0.65rem; text-transform:uppercase; letter-spacing:0.1em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.5rem;">Pendientes</p>
        <p style="font-size:2rem; font-weight:900; color:#ffee00;">{{ pending }}</p>
      </div>
    </div>

    <!-- Tracking table -->
    <div class="glass-strong" style="border-radius:1.5rem; border:1px solid rgba(255,255,255,0.08); overflow:hidden;">
      <div style="overflow-x:auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Personal</th>
              <th>Rol</th>
              <th>Centro / ASIC</th>
              <th>Estado de Hoy</th>
              <th>Reportes este Mes</th>
              <th>Contacto</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in tracking" :key="p.userId">
              <td>
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <div :style="{width:'36px',height:'36px',borderRadius:'10px',background:p.hasReportedToday ? 'rgba(0,255,136,0.2)' : 'rgba(255,238,0,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem'}">
                    {{ p.hasReportedToday ? '✅' : '⏳' }}
                  </div>
                  <div>
                    <p style="font-size:0.85rem; font-weight:600;">{{ p.name }}</p>
                    <p style="font-size:0.65rem; color:rgba(255,255,255,0.4);">{{ p.specialty }}</p>
                  </div>
                </div>
              </td>
              <td><span :class="['badge', roleBadge(p.role)]" style="text-transform:capitalize;">{{ p.role }}</span></td>
              <td>
                <p style="font-size:0.8rem;">{{ p.center }}</p>
                <p style="font-size:0.65rem; color:rgba(255,255,255,0.4);">{{ p.asic }}</p>
              </td>
              <td>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span :class="['badge', p.hasReportedToday ? 'badge-success' : 'badge-warning']">
                    {{ p.hasReportedToday ? '✓ Reportó' : '⏳ Pendiente' }}
                  </span>
                </div>
              </td>
              <td style="text-align:center;">
                <span style="font-size:1.25rem; font-weight:900;" :style="{color: p.totalReportsThisMonth >= 15 ? '#00ff88' : p.totalReportsThisMonth >= 8 ? '#ffee00' : '#ff00aa'}">{{ p.totalReportsThisMonth }}</span>
              </td>
              <td>
                <button v-if="!p.hasReportedToday" @click="remindOne(p)" style="padding:0.4rem 0.75rem; background:rgba(0,255,136,0.1); border:1px solid rgba(0,255,136,0.2); border-radius:6px; color:#00ff88; cursor:pointer; font-size:0.75rem; font-weight:700; transition:all 0.2s;" title="Enviar WhatsApp">💬 WhatsApp</button>
                <span v-else style="font-size:0.7rem; color:rgba(255,255,255,0.3);">Al día</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMainStore } from '../stores/mainStore'

const store = useMainStore()

const today = new Date().toLocaleDateString('es-VE', { weekday: 'long', day: 'numeric', month: 'long' })
const tracking = computed(() => store.getDoctorTrackingStatuses)
const total = computed(() => tracking.value.length)
const reported = computed(() => tracking.value.filter(p => p.hasReportedToday).length)
const pending = computed(() => total.value - reported.value)
const progressPct = computed(() => total.value > 0 ? Math.round((reported.value / total.value) * 100) : 0)

const roleBadge = (r) => ({ administrador:'badge-danger', coordinador:'badge-warning', doctor:'badge-info', enfermero:'badge-success' }[r] || 'badge-info')

function remindOne(p) {
  const msg = `Estimado/a ${p.name}, le recordamos que aún no ha enviado su reporte médico del día ${new Date().toLocaleDateString('es-VE')}. Por favor ingrese al sistema MediReport Pro lo antes posible. Gracias. — Alcaldía Santiago Mariño`
  store.contactViaWhatsApp(p.phone, msg)
}

function remindAll() {
  const pending = tracking.value.filter(p => !p.hasReportedToday)
  if (pending.length === 0) { store.addNotification('Todo el personal ya reportó hoy ✅', 'success'); return }
  pending.forEach(p => store.contactViaWhatsApp(p.phone, `Estimado/a ${p.name}, por favor envíe su reporte del día de hoy en MediReport Pro. — Alcaldía Santiago Mariño`))
  store.addNotification(`Recordatorio enviado a ${pending.length} personas`, 'info')
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
    const rows = tracking.value.map(p => ({
      'Personal': p.name,
      'Especialidad': p.specialty,
      'Rol': p.role,
      'Centro de Salud': p.center,
      'ASIC': p.asic,
      'Teléfono': p.phone,
      'Estado (Hoy)': p.hasReportedToday ? 'Reportó' : 'Pendiente',
      'Reportes este Mes': p.totalReportsThisMonth
    }))
    
    if (rows.length === 0) {
      store.addNotification('No hay datos de seguimiento para exportar', 'warning')
      return
    }

    const ws = XLSX.utils.json_to_sheet(rows)
    autoFitColumns(XLSX, ws)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Seguimiento')
    XLSX.writeFile(wb, `Seguimiento_Personal_${new Date().toISOString().slice(0,10)}.xlsx`)
    store.addNotification('Excel de Seguimiento descargado exitosamente', 'success')
  })
}
</script>
