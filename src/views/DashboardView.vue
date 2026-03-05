<template>
  <div style="display:flex; flex-direction:column; gap:1.5rem;" class="animate__animated animate__fadeIn">

    <!-- Welcome Card -->
    <div class="glass-strong" style="border-radius:1.5rem; padding:2rem; border:1px solid rgba(255,255,255,0.08); position:relative; overflow:hidden;">
      <div style="position:absolute; top:-40px; right:-40px; width:200px; height:200px; background:rgba(0,243,255,0.07); border-radius:50%; filter:blur(60px);" class="animate-pulse-slow" />
      <div style="display:flex; flex-wrap:wrap; align-items:center; gap:1.5rem; position:relative; z-index:1;">
        <div style="display:flex; align-items:center; gap:1rem;">
          <div style="width:64px; height:64px; border-radius:16px; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; font-size:2.5rem;" class="animate-bounce-slow">{{ greetingIcon }}</div>
          <div>
            <h2 style="font-size:1.75rem; font-weight:900; line-height:1.2;">{{ greetingText }}, <span class="text-gradient">{{ firstName }}</span></h2>
            <p style="color:rgba(255,255,255,0.45); font-size:0.85rem; margin-top:0.25rem; font-style:italic;">{{ randomMotto }}</p>
          </div>
        </div>
        <div style="margin-left:auto; display:flex; gap:0.75rem; flex-wrap:wrap;">
          <router-link to="/app/reportes/nuevo" class="btn-primary">📝 Nuevo Reporte</router-link>
          <router-link to="/app/jornadas" class="btn-glass">🗺️ Jornadas</router-link>
        </div>
      </div>
    </div>

    <!-- KPI Stats -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1rem;">
      <div v-for="(kpi, i) in kpis" :key="i" class="card-glass" style="position:relative; overflow:hidden;">
        <div style="position:absolute; top:-20px; right:-20px; width:80px; height:80px; border-radius:50%; opacity:0.15;" :style="{background: kpi.glow}" />
        <div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1rem;">
          <div :style="{width:'48px',height:'48px',borderRadius:'12px',background:kpi.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',boxShadow:'0 4px 20px '+kpi.glow+'40'}">{{ kpi.icon }}</div>
          <span v-if="kpi.trend" :style="{fontSize:'0.65rem',fontWeight:800,padding:'0.2rem 0.6rem',borderRadius:'999px',background:kpi.trendBg,color:kpi.trendColor}">{{ kpi.trend }}</span>
        </div>
        <p style="font-size:2.5rem; font-weight:900; line-height:1; margin-bottom:0.25rem;" :style="{color:kpi.textColor}">{{ kpi.value }}</p>
        <p style="font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:rgba(255,255,255,0.35);">{{ kpi.label }}</p>
      </div>
    </div>

    <!-- V5: Interactive Charts Row -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;">
      <!-- Bar Chart - Monthly Activity -->
      <div class="glass-strong" style="border-radius:1.5rem; padding:1.75rem; border:1px solid rgba(255,255,255,0.08);">
        <h3 class="font-display" style="font-size:1.1rem; font-weight:800; margin-bottom:1rem;">📊 Actividad Epidemiológica Mensual</h3>
        <div style="height:220px;">
          <Bar v-if="barChartReady" :data="barChartData" :options="barChartOptions" />
        </div>
      </div>
      <!-- Doughnut Chart - Report Types -->
      <div class="glass-strong" style="border-radius:1.5rem; padding:1.75rem; border:1px solid rgba(255,255,255,0.08);">
        <h3 class="font-display" style="font-size:1.1rem; font-weight:800; margin-bottom:1rem;">🎯 Distribución por Tipo</h3>
        <div style="height:220px; display:flex; align-items:center; justify-content:center;">
          <Doughnut v-if="barChartReady" :data="doughnutChartData" :options="doughnutChartOptions" />
        </div>
      </div>
    </div>

    <!-- V5: Epidemiological Alert Engine -->
    <div v-if="epidemioAlerts.length > 0" class="glass-strong" style="border-radius:1.5rem; padding:1.75rem; border:1px solid rgba(255,0,170,0.3); background:rgba(255,0,170,0.05);">
      <h3 class="font-display" style="font-size:1.1rem; font-weight:800; color:#ff00aa; margin-bottom:1rem;">🚨 Alertas Epidemiológicas Automáticas</h3>
      <div style="display:flex; flex-direction:column; gap:0.75rem;">
        <div v-for="ea in epidemioAlerts" :key="ea.asic" style="display:flex; align-items:center; gap:1rem; padding:0.75rem 1rem; background:rgba(255,0,170,0.08); border-radius:0.75rem; border:1px solid rgba(255,0,170,0.15);">
          <span style="font-size:1.5rem;">⚠️</span>
          <div style="flex:1;">
            <p style="font-weight:700; font-size:0.85rem;">Pico de morbilidad detectado en <span style="color:#ff00aa;">{{ ea.asic }}</span></p>
            <p style="font-size:0.7rem; color:rgba(255,255,255,0.5);">{{ ea.count }} reportes en las últimas 72 horas — {{ ea.emergencias }} emergencias registradas</p>
          </div>
          <span :class="['badge', 'badge-danger']">CRÍTICO</span>
        </div>
      </div>
    </div>

    <!-- V5: Medical Chatbot -->
    <div class="glass-strong" style="border-radius:1.5rem; padding:1.75rem; border:1px solid rgba(255,255,255,0.08);">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
        <h3 class="font-display" style="font-size:1.1rem; font-weight:800;">🤖 Asistente Médico Institucional</h3>
        <span class="badge badge-success">ONLINE</span>
      </div>
      <div ref="chatContainer" style="height:200px; overflow-y:auto; display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1rem; padding:0.5rem;" class="custom-scrollbar">
        <div v-for="(msg, i) in chatMessages" :key="i" :style="{alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start', maxWidth:'80%'}">
          <div :style="{padding:'0.6rem 1rem', borderRadius: msg.from === 'user' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem', background: msg.from === 'user' ? 'rgba(0,243,255,0.15)' : 'rgba(255,255,255,0.06)', border: '1px solid ' + (msg.from === 'user' ? 'rgba(0,243,255,0.2)' : 'rgba(255,255,255,0.08)'), fontSize:'0.8rem', lineHeight:'1.4'}">
            {{ msg.text }}
          </div>
        </div>
      </div>
      <div style="display:flex; gap:0.5rem;">
        <input v-model="chatInput" @keyup.enter="sendChat" class="input-glass" style="flex:1;" placeholder="Consulta protocolos, dosificaciones, CIE-10..." />
        <button @click="sendChat" class="btn-primary" style="padding:0.5rem 1.25rem;">Enviar</button>
      </div>
    </div>

    <!-- Recent Activity + Report Types -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;">
      <div class="glass-strong" style="border-radius:1.5rem; padding:1.75rem; border:1px solid rgba(255,255,255,0.08); display:flex; flex-direction:column;">
        <h3 class="font-display" style="font-size:1.1rem; font-weight:800; margin-bottom:1.25rem;">🔔 Actividad Reciente</h3>
        <div style="flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:0.75rem;" class="custom-scrollbar">
          <div v-for="(act, i) in activities" :key="i" style="display:flex; align-items:flex-start; gap:0.75rem; padding:0.75rem; background:rgba(255,255,255,0.03); border-radius:0.75rem; transition:all 0.2s;" class="activity-item">
            <div :style="{width:'36px',height:'36px',borderRadius:'10px',background:act.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0}">{{ act.icon }}</div>
            <div style="flex:1; min-width:0;">
              <p style="font-size:0.75rem; font-weight:600; line-height:1.3;">{{ act.title }}</p>
              <p style="font-size:0.65rem; color:rgba(255,255,255,0.35); margin-top:0.15rem;">{{ act.time }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="glass-strong" style="border-radius:1.5rem; padding:1.75rem; border:1px solid rgba(255,255,255,0.08);">
        <h3 class="font-display" style="font-size:1.1rem; font-weight:800; margin-bottom:1.5rem;">Reportes por Categoría</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(120px,1fr)); gap:1rem;">
          <div v-for="(rt, i) in reportTypes" :key="i" :style="{padding:'1rem',borderRadius:'1rem',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',textAlign:'center',transition:'all 0.3s'}" class="report-type-item">
            <div :style="{width:'44px',height:'44px',margin:'0 auto 0.5rem',borderRadius:'10px',background:rt.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.25rem'}">{{ rt.icon }}</div>
            <p style="font-size:1.75rem; font-weight:900; margin-bottom:0.15rem;" :style="{color:rt.color}">{{ rt.count }}</p>
            <p style="font-size:0.55rem; text-transform:uppercase; letter-spacing:0.1em; color:rgba(255,255,255,0.35); font-weight:700;">{{ rt.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useMainStore } from '../stores/mainStore'
import { Bar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const store = useMainStore()
const stats = computed(() => store.getDashboardStats)
const barChartReady = ref(false)
onMounted(() => { barChartReady.value = true })

const firstName = computed(() => store.currentUser?.name.split(' ')[0] || 'Usuario')
const hour = new Date().getHours()
const greetingText = computed(() => hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches')
const greetingIcon = computed(() => hour < 12 ? '☀️' : hour < 18 ? '🌤️' : '🌙')
const mottos = ['Gente Que Resuelve.', 'Compromiso con la salud pública.', 'La eficiencia salva vidas.', 'Unidos por Santiago Mariño.', 'Innovación médica al servicio del pueblo.']
const randomMotto = mottos[new Date().getMinutes() % mottos.length]

const kpis = computed(() => [
  { icon: '📋', label: 'Total Reportes', value: stats.value.totalReportes, textColor: '#00f3ff', bg: 'rgba(0,243,255,0.15)', glow: '#00f3ff', trend: '+12%', trendBg: 'rgba(0,255,136,0.15)', trendColor: '#00ff88' },
  { icon: '✅', label: 'Completados', value: stats.value.reportesHoy, textColor: '#00ff88', bg: 'rgba(0,255,136,0.15)', glow: '#00ff88', trend: 'HOY', trendBg: 'rgba(0,243,255,0.15)', trendColor: '#00f3ff' },
  { icon: '🗺️', label: 'Jornadas Activas', value: stats.value.jornadasActivas, textColor: '#b026ff', bg: 'rgba(176,38,255,0.15)', glow: '#b026ff', trend: null },
  { icon: '👥', label: 'Personal Activo', value: stats.value.personalActivo, textColor: '#ffee00', bg: 'rgba(255,238,0,0.15)', glow: '#ffee00', trend: null },
])

// ─── V5: CHART.JS DATA ───
const barChartData = computed(() => ({
  labels: stats.value.reportsByMonth.map(m => m.month),
  datasets: [{
    label: 'Reportes',
    data: stats.value.reportsByMonth.map(m => m.count),
    backgroundColor: ['#00f3ff','#b026ff','#ff00aa','#00ff88','#ffee00','#00f3ff','#b026ff','#ff00aa','#00ff88','#ffee00','#00f3ff','#b026ff'].map(c => c + '80'),
    borderColor: ['#00f3ff','#b026ff','#ff00aa','#00ff88','#ffee00','#00f3ff','#b026ff','#ff00aa','#00ff88','#ffee00','#00f3ff','#b026ff'],
    borderWidth: 1,
    borderRadius: 6
  }]
}))
const barChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } }, grid: { display: false } }, y: { ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } } } }

const doughnutChartData = computed(() => ({
  labels: ['Morbilidad', 'Mortalidad', 'CDI', 'Acción Comunal', 'Especialidad'],
  datasets: [{
    data: [stats.value.reportsByType.morbilidad, stats.value.reportsByType.mortalidad, stats.value.reportsByType.cdi, stats.value.reportsByType.accion_comunal, stats.value.reportsByType.especialidad],
    backgroundColor: ['#00f3ff', '#ff00aa', '#b026ff', '#00ff88', '#ffee00'],
    borderColor: 'rgba(10,10,30,0.8)',
    borderWidth: 2
  }]
}))
const doughnutChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: 'rgba(255,255,255,0.6)', font: { size: 10 }, padding: 12, usePointStyle: true, pointStyleWidth: 10 } } } }

// ─── V5: EPIDEMIOLOGICAL ALERT ENGINE ───
const epidemioAlerts = computed(() => {
  const now = Date.now()
  const threshold72h = 72 * 60 * 60 * 1000
  const asicCounts = {}
  store.reports.filter(r => r.tipo === 'morbilidad' && (now - new Date(r.createdAt).getTime()) < threshold72h).forEach(r => {
    if (!asicCounts[r.asic]) asicCounts[r.asic] = { count: 0, emergencias: 0 }
    asicCounts[r.asic].count++
    asicCounts[r.asic].emergencias += (r.datos?.emergencias || 0)
  })
  return Object.entries(asicCounts).filter(([_, v]) => v.count >= 2 || v.emergencias >= 30).map(([asic, v]) => ({ asic, ...v }))
})

// ─── V5: MEDICAL CHATBOT ───
const chatInput = ref('')
const chatContainer = ref(null)
const chatMessages = ref([
  { from: 'bot', text: '¡Hola! Soy el asistente médico institucional de MediReport Pro. Puedo consultar protocolos del MPPS, ayudarte con dosificaciones y códigos CIE-10. ¿En qué te puedo ayudar?' }
])

const medicalKB = {
  dengue: 'Protocolo Dengue MPPS: Hidratación oral/IV, monitoreo de plaquetas. Signos de alarma: dolor abdominal, vómitos, sangrado. Clasificación: Sin alarma / Con alarma / Grave.',
  covid: 'Protocolo COVID-19: Aislamiento 5 días, Paracetamol 500mg c/6h, oximetría. Derivar si SpO2 < 94%. Vacunas: esquema completo + refuerzo.',
  hipertension: 'HTA: Captopril 25mg SL para crisis. Mantenimiento: Losartán 50mg/día o Amlodipino 5mg/día. Meta: <140/90 mmHg.',
  diabetes: 'Diabetes Tipo 2: Metformina 500mg c/12h inicial. HbA1c meta <7%. Insulina si Glicemia >300mg/dL persistente.',
  vacunacion: 'Esquema Nacional de Vacunación: BCG (RN), Pentavalente (2,4,6m), SRP (12m), FA (12m). COVID: Sinopharm/Sputnik refuerzo anual.',
  embarazo: 'Control Prenatal MPPS: mínimo 6 consultas. Labs: Hb, Grupo/Rh, VIH, VDRL, Urocultivo. Ecografías: 12, 20, 32 semanas.',
  'cie-10': 'Códigos CIE-10 frecuentes: J06.9 (IRA), A90 (Dengue), J18.9 (Neumonía), E11 (DM2), I10 (HTA), K29.7 (Gastritis).',
  malaria: 'Protocolo Malaria: Cloroquina 600mg + Primaquina 15mg x 14 días (P. vivax). P. falciparum: Artesunato + Mefloquina.',
  dosificacion: 'Dosificaciones frecuentes: Amoxicilina 500mg c/8h, Ibuprofeno 400mg c/8h, Omeprazol 20mg/día, Metformina 500-850mg c/12h.'
}

function sendChat() {
  const q = chatInput.value.trim()
  if (!q) return
  chatMessages.value.push({ from: 'user', text: q })
  chatInput.value = ''
  
  setTimeout(() => {
    const lower = q.toLowerCase()
    let response = 'No encontré información específica sobre eso en la base de protocolos. Intenta con: dengue, covid, hipertensión, diabetes, vacunación, embarazo, CIE-10, malaria o dosificación.'
    for (const [key, val] of Object.entries(medicalKB)) {
      if (lower.includes(key)) { response = val; break }
    }
    chatMessages.value.push({ from: 'bot', text: response })
    nextTick(() => { if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight })
  }, 500)
}

// Activities
const activities = [
  { icon: '📋', title: 'Reporte de morbilidad enviado', time: 'Hace 5 min', bg: 'rgba(0,243,255,0.15)' },
  { icon: '🗺️', title: 'Jornada de vacunación programada', time: 'Hace 30 min', bg: 'rgba(176,38,255,0.15)' },
  { icon: '🚨', title: 'Alerta epidemiológica activa', time: 'Hace 1 hora', bg: 'rgba(255,0,170,0.15)' },
  { icon: '📊', title: 'Consolidado semanal exportado', time: 'Hace 3 horas', bg: 'rgba(0,255,136,0.15)' },
  { icon: '👤', title: 'Nuevo usuario registrado', time: 'Ayer', bg: 'rgba(255,238,0,0.15)' },
]

const reportTypes = computed(() => [
  { icon: '📋', name: 'Morbilidad', count: stats.value.reportsByType.morbilidad, color: '#00f3ff', bg: 'rgba(0,243,255,0.15)' },
  { icon: '💀', name: 'Mortalidad', count: stats.value.reportsByType.mortalidad, color: '#ff00aa', bg: 'rgba(255,0,170,0.15)' },
  { icon: '🏥', name: 'CDI', count: stats.value.reportsByType.cdi, color: '#b026ff', bg: 'rgba(176,38,255,0.15)' },
  { icon: '🤝', name: 'Acción Comunal', count: stats.value.reportsByType.accion_comunal, color: '#00ff88', bg: 'rgba(0,255,136,0.15)' },
  { icon: '⭐', name: 'Especialidad', count: stats.value.reportsByType.especialidad, color: '#ffee00', bg: 'rgba(255,238,0,0.15)' },
])
</script>

<style scoped>
.activity-item:hover { background: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.08) !important; }
.report-type-item:hover { background: rgba(255,255,255,0.06) !important; transform: translateY(-3px); }
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 999px; }
@media (max-width: 768px) {
  div[style*="grid-template-columns:1fr 1fr"] { grid-template-columns: 1fr !important; }
}
</style>
