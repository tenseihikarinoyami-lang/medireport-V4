<template>
  <div class="animate__animated animate__fadeIn">
    <!-- Header -->
    <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1.75rem;">
      <button @click="$router.back()" class="btn-glass" style="padding:0.6rem 0.9rem;">← Volver</button>
      <div>
        <h2 class="font-display" style="font-size:1.5rem; font-weight:800;">Nuevo Reporte</h2>
        <p style="color:rgba(255,255,255,0.4); font-size:0.8rem;">Completa el formulario para registrar</p>
      </div>
    </div>

    <!-- Steps indicator -->
    <div class="glass-strong" style="border-radius:1.25rem; padding:1.25rem 2rem; margin-bottom:1.75rem; border:1px solid rgba(255,255,255,0.08);">
      <div style="display:flex; align-items:center; justify-content:center; gap:1rem; flex-wrap:wrap;">
        <div v-for="(step, i) in steps" :key="i" style="display:flex; align-items:center; gap:0.75rem;">
          <div :style="{
            width:'36px', height:'36px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:800, fontSize:'0.875rem',
            background: currentStep > i ? 'rgba(0,255,136,0.2)' : currentStep === i ? 'rgba(0,243,255,0.2)' : 'rgba(255,255,255,0.06)',
            color: currentStep > i ? '#00ff88' : currentStep === i ? '#00f3ff' : 'rgba(255,255,255,0.3)',
            border: '2px solid ' + (currentStep > i ? '#00ff88' : currentStep === i ? '#00f3ff' : 'rgba(255,255,255,0.08)'),
            boxShadow: currentStep === i ? '0 0 15px rgba(0,243,255,0.4)' : 'none',
            transition: 'all 0.3s'
          }">
            {{ currentStep > i ? '✓' : i+1 }}
          </div>
          <span :style="{fontSize:'0.85rem', fontWeight:600, color: currentStep === i ? '#00f3ff' : 'rgba(255,255,255,0.4)', transition:'color 0.3s'}">{{ step.label }}</span>
          <div v-if="i < steps.length-1" style="width:40px; height:1px; background:rgba(255,255,255,0.1); display:none;" />
        </div>
      </div>
    </div>

    <!-- Step 1: Select type -->
    <div v-if="currentStep === 0" class="glass-strong" style="border-radius:1.5rem; padding:2rem; border:1px solid rgba(255,255,255,0.08);">
      <h3 style="font-size:1.1rem; font-weight:700; margin-bottom:1.5rem;">Selecciona el tipo de reporte</h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:1rem;">
        <button v-for="t in reportTypes" :key="t.id" @click="selectType(t.id)"
          :style="{padding:'1.5rem 1rem', borderRadius:'1rem', border:'2px solid '+(selectedType===t.id ? t.borderColor : 'rgba(255,255,255,0.06)'), background:'rgba(255,255,255,0.03)', textAlign:'left', cursor:'pointer', transition:'all 0.3s', transform: selectedType===t.id ? 'translateY(-4px)' : 'none', boxShadow: selectedType===t.id ? '0 10px 30px '+t.glow : 'none'}">
          <div :style="{width:'48px', height:'48px', borderRadius:'12px', background:t.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', marginBottom:'0.75rem'}">{{ t.icon }}</div>
          <h4 style="font-weight:700; font-size:0.9rem; color:white; margin-bottom:0.25rem;">{{ t.label }}</h4>
          <p style="font-size:0.7rem; color:rgba(255,255,255,0.4);">{{ t.description }}</p>
        </button>
      </div>
      <div style="display:flex; justify-content:flex-end; margin-top:1.5rem;">
        <button @click="currentStep++" :disabled="!selectedType" class="btn-primary" :style="{opacity: selectedType ? 1 : 0.4}">Continuar →</button>
      </div>
    </div>

    <!-- Step 2: Fill data -->
    <div v-if="currentStep === 1" style="display:flex; flex-direction:column; gap:1.25rem;">
      <div class="glass-strong" style="border-radius:1.5rem; padding:2rem; border:1px solid rgba(255,255,255,0.08);">
        <h3 style="font-size:1rem; font-weight:700; margin-bottom:1.25rem;">📋 Información General</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1rem;">
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Semana Epidemiológica</label>
            <input v-model.number="form.semana" type="number" min="1" max="52" class="input-glass" />
          </div>
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Fecha</label>
            <input v-model="form.fecha" type="date" class="input-glass" />
          </div>
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">Centro de Salud <span style="color:#00f3ff; font-size:0.55rem;">(Auto)</span></label>
            <select v-model="form.centroSalud" class="input-glass">
              <option v-for="c in store.CENTROS_SALUD" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div>
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">ASIC <span style="color:#00f3ff; font-size:0.55rem;">(Auto)</span></label>
            <select v-model="form.asic" class="input-glass">
              <option v-for="a in store.ASIC_LIST" :key="a" :value="a">{{ a }}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="glass-strong" style="border-radius:1.5rem; padding:2rem; border:1px solid rgba(255,255,255,0.08);">
        <h3 style="font-size:1rem; font-weight:700; margin-bottom:1.25rem;">📊 Indicadores — {{ currentTypeLabel }}</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1rem;">
          <div v-for="f in currentFields" :key="f.name">
            <label style="display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.4); font-weight:700; margin-bottom:0.4rem;">{{ f.label }}</label>
            <input v-if="f.type==='number'" v-model.number="form.datos[f.name]" type="number" min="0" class="input-glass" placeholder="0" />
            <input v-else v-model="form.datos[f.name]" type="text" class="input-glass" :placeholder="f.placeholder||''" />
          </div>
        </div>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <button @click="currentStep--" class="btn-glass">← Anterior</button>
        <button @click="currentStep++" class="btn-primary">Continuar →</button>
      </div>
    </div>

    <!-- Step 3: Preview & submit -->
    <div v-if="currentStep === 2" class="glass-strong" style="border-radius:1.5rem; padding:2rem; border:1px solid rgba(255,255,255,0.08);">
      <h3 style="font-size:1rem; font-weight:700; margin-bottom:1.5rem;">✅ Vista Previa del Reporte</h3>

      <!-- Ticket preview -->
      <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(0,243,255,0.2); border-radius:1rem; padding:1.5rem; margin-bottom:1.5rem; font-family:monospace;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; padding-bottom:1rem; border-bottom:1px dashed rgba(255,255,255,0.15);">
          <div>
            <p style="font-size:0.65rem; color:rgba(0,243,255,0.7); text-transform:uppercase; letter-spacing:0.15em; font-weight:800;">ALCALDÍA MUNICIPIO SANTIAGO MARIÑO</p>
            <h4 style="font-size:1.1rem; font-weight:700; color:#00f3ff; margin-top:0.25rem;">REPORTE {{ currentTypeLabel.toUpperCase() }}</h4>
          </div>
          <div style="text-align:right;">
            <p style="font-size:0.7rem; color:rgba(255,255,255,0.4);">Semana Epidemiológica</p>
            <p style="font-size:2rem; font-weight:900; color:#b026ff; line-height:1;">{{ form.semana }}</p>
          </div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin-bottom:1rem;">
          <div v-for="(v, k) in {Fecha: form.fecha, Centro: form.centroSalud, ASIC: form.asic, Responsable: store.currentUser?.name}" :key="k">
            <p style="font-size:0.55rem; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.1em;">{{ k }}</p>
            <p style="font-size:0.8rem; font-weight:600;">{{ v }}</p>
          </div>
        </div>
        <div style="border-top:1px dashed rgba(255,255,255,0.15); padding-top:1rem;">
          <p style="font-size:0.6rem; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:0.5rem;">INDICADORES</p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.35rem;">
            <div v-for="(v, k) in form.datos" :key="k" style="display:flex; justify-content:space-between;">
              <span style="font-size:0.7rem; color:rgba(255,255,255,0.5); text-transform:capitalize;">{{ k.replace(/([A-Z])/g,' $1').trim() }}:</span>
              <span style="font-size:0.7rem; font-weight:700; color:#00ff88;">{{ v }}</span>
            </div>
          </div>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between;">
        <button @click="currentStep--" class="btn-glass">← Anterior</button>
        <button @click="submitReport" class="btn-primary">🚀 Enviar Reporte</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../stores/mainStore'
import { getWeekNumber } from '../stores/mainStore'

const store = useMainStore()
const router = useRouter()
const currentStep = ref(0)
const selectedType = ref('')

const steps = [{ label: 'Tipo' }, { label: 'Datos' }, { label: 'Confirmar' }]

const reportTypes = [
  { id: 'morbilidad', label: 'Morbilidad', description: 'Consultas, hospitalizaciones, partos', icon: '📋', bg: 'rgba(0,243,255,0.15)', borderColor: '#00f3ff', glow: 'rgba(0,243,255,0.3)' },
  { id: 'mortalidad', label: 'Mortalidad', description: 'Defunciones, maternas, perinatales', icon: '💀', bg: 'rgba(255,0,170,0.15)', borderColor: '#ff00aa', glow: 'rgba(255,0,170,0.3)' },
  { id: 'cdi', label: 'CDI', description: 'Consultas, despistajes, inmunizaciones', icon: '🏥', bg: 'rgba(176,38,255,0.15)', borderColor: '#b026ff', glow: 'rgba(176,38,255,0.3)' },
  { id: 'accion_comunal', label: 'Acción Comunal', description: 'Actividades comunitarias, personas atendidas', icon: '🤝', bg: 'rgba(0,255,136,0.15)', borderColor: '#00ff88', glow: 'rgba(0,255,136,0.3)' },
  { id: 'especialidad', label: 'Especialidad', description: 'Consultas especializadas, quirúrgicas', icon: '⭐', bg: 'rgba(255,238,0,0.15)', borderColor: '#ffee00', glow: 'rgba(255,238,0,0.3)' },
]

const fieldMap = {
  morbilidad: [
    { name:'emergencias', label:'Emergencias', type:'number' }, { name:'consultas', label:'Consultas', type:'number' },
    { name:'vidasSalvadas', label:'Vidas Salvadas', type:'number' }, { name:'hospitalizaciones', label:'Hospitalizaciones', type:'number' },
    { name:'cirugias', label:'Cirugías', type:'number' }, { name:'partos', label:'Partos', type:'number' }
  ],
  mortalidad: [
    { name:'defunciones', label:'Defunciones Totales', type:'number' }, { name:'perinatales', label:'Perinatales', type:'number' },
    { name:'maternas', label:'Maternas', type:'number' }, { name:'causas', label:'Causa Principal', type:'text', placeholder:'Describir...' }
  ],
  cdi: [
    { name:'consultas', label:'Consultas', type:'number' }, { name:'despistajes', label:'Despistajes', type:'number' },
    { name:'inmunizaciones', label:'Inmunizaciones', type:'number' }, { name:'planificacion', label:'Planificación Familiar', type:'number' }
  ],
  accion_comunal: [
    { name:'personasAtendidas', label:'Personas Atendidas', type:'number' }, { name:'adultosMayores', label:'Adultos Mayores', type:'number' },
    { name:'discapacitados', label:'Personas con Discapacidad', type:'number' }, { name:'oncologicos', label:'Oncológicos', type:'number' }
  ],
  especialidad: [
    { name:'femenino', label:'Pacientes Femenino', type:'number' }, { name:'masculino', label:'Pacientes Masculino', type:'number' },
    { name:'qx', label:'Cirugías (QX)', type:'number' }, { name:'hospitalizados', label:'Hospitalizados', type:'number' }
  ],
}

const form = reactive({
  semana: getWeekNumber(),
  fecha: new Date().toISOString().slice(0,10),
  centroSalud: store.currentUser?.center || store.CENTROS_SALUD[0],
  asic: store.currentUser?.asic || store.ASIC_LIST[0],
  datos: {}
})

const currentFields = computed(() => fieldMap[selectedType.value] || [])
const currentTypeLabel = computed(() => reportTypes.find(t => t.id === selectedType.value)?.label || '')

function selectType(id) {
  selectedType.value = id
  form.datos = {}
  currentFields.value.forEach(f => { form.datos[f.name] = f.type === 'number' ? 0 : '' })
}

function submitReport() {
  store.addReport({
    tipo: selectedType.value,
    semana: form.semana,
    fecha: form.fecha,
    centroSalud: form.centroSalud,
    asic: form.asic,
    estado: 'completado',
    createdByUserId: store.currentUser?.id,
    createdByName: store.currentUser?.name,
    datos: { ...form.datos }
  })
  router.push('/app/reportes')
}
</script>
