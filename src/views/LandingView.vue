<template>
  <div class="min-h-screen relative overflow-hidden bg-dark-900">
    <!-- Background Effects -->
    <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(var(--color-neon-blue) 1px, transparent 1px); background-size: 40px 40px;"></div>
    <div class="absolute top-20 left-10 w-96 h-96 bg-[var(--color-neon-blue)]/20 rounded-full blur-[120px] animate-pulse-slow"></div>
    <div class="absolute bottom-20 right-10 w-80 h-80 bg-[var(--color-neon-purple)]/20 rounded-full blur-[100px] animate-pulse-slow" style="animation-delay: 1s"></div>
    
    <!-- Floating Particles -->
    <div class="particles-container absolute inset-0 pointer-events-none">
      <div v-for="n in 20" :key="n" 
           class="absolute w-1 h-1 bg-[var(--color-neon-blue)] rounded-full  opacity-30"
           :style="{ 
             left: Math.random() * 100 + '%', 
             top: Math.random() * 100 + '%', 
             animationDelay: Math.random() * 5 + 's',
             animationDuration: (4 + Math.random() * 4) + 's'
           }">
      </div>
    </div>

    <!-- Navigation -->
    <nav class="relative z-50 px-8 py-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-neon-blue)] via-[var(--color-neon-purple)] to-[var(--color-neon-pink)] p-[2px] animate-pulse-glow">
            <div class="w-full h-full rounded-2xl bg-[var(--color-dark-900)] flex items-center justify-center">
              <span class="text-3xl">🏥</span>
            </div>
          </div>
          <div>
            <h1 class="font-display font-black text-2xl text-gradient">MediReport</h1>
            <p class="text-xs text-[var(--color-neon-blue)] font-semibold tracking-widest uppercase">Municipio Santiago Mariño</p>
          </div>
        </div>
        <div class="hidden md:flex items-center gap-8">
          <a href="#features" class="text-gray-300 hover:text-white transition-colors font-medium">Características</a>
          <a href="#templates" class="text-gray-300 hover:text-white transition-colors font-medium">Plantillas</a>
          <a href="#branding" class="text-gray-300 hover:text-white transition-colors font-medium">Gestión</a>
        </div>
        <router-link to="/login" class="btn-primary flex items-center gap-2">
          <span>Iniciar Sesión</span>
          <span class="text-lg">→</span>
        </router-link>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative z-10 px-8 pt-12 pb-20">
      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div class="space-y-8 animate__animated animate__fadeInLeft">
            <div class="inline-flex items-center gap-3 glass px-5 py-3 rounded-full">
              <span class="w-3 h-3 bg-[var(--color-neon-green)] rounded-full animate-pulse"></span>
              <span class="text-sm font-medium text-gray-300">Sistema Oficial MPPS Venezuela</span>
            </div>
            <div class="space-y-4">
              <h2 class="font-display font-black text-5xl lg:text-7xl leading-tight">
                <span class="text-white">Sistema Integral de</span><br>
                <span class="text-gradient">Reportes Médicos</span><br>
                <span class="text-[var(--color-neon-blue)] text-4xl lg:text-5xl uppercase font-light tracking-widest">Santiago Mariño</span>
              </h2>
              <p class="text-xl text-gray-400 max-w-xl leading-relaxed">
                Plataforma vanguardista para la gestión eficiente de reportes médicos en el Municipio Santiago Mariño.
              </p>
            </div>
            <div class="flex flex-wrap gap-4">
              <router-link to="/login" class="btn-primary text-lg px-8 py-4">
                <span>Comenzar Ahora</span>
                <span class="ml-2">🚀</span>
              </router-link>
              <a href="#features" class="btn-glass text-lg px-8 py-4 flex items-center gap-2">
                <span>Conocer Más</span>
                <span>↓</span>
              </a>
            </div>
          </div>

          <!-- Enhanced V4 Preview (Live metrics, V3 style) -->
          <div class="relative animate__animated animate__fadeInRight">
            <div class="absolute inset-0 bg-gradient-to-r from-[var(--color-neon-blue)]/30 to-[var(--color-neon-purple)]/30 rounded-3xl blur-3xl"></div>
            <div class="relative glass-strong rounded-3xl p-6 border border-white/20 shadow-glass-lg overflow-hidden">
              <div class="absolute top-0 right-0 w-64 h-64 bg-[var(--color-neon-blue)]/5 rounded-full blur-3xl"></div>
              
              <!-- System Status Header -->
              <div class="flex items-center justify-between mb-8 relative z-10">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,243,255,0.4)]">
                    <span class="text-xl">📊</span>
                  </div>
                  <div>
                    <h4 class="font-bold text-white leading-tight">Monitor V4</h4>
                    <span class="text-[0.6rem] text-[var(--color-neon-green)] uppercase tracking-widest font-black flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-[var(--color-neon-green)] animate-pulse"></span> ONLINE
                    </span>
                  </div>
                </div>
                <div class="glass px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                  <span class="text-[0.65rem] text-gray-400 font-bold uppercase tracking-wider">Hoy</span>
                  <span class="text-xs font-black text-white">12:45 PM</span>
                </div>
              </div>

              <!-- Main KPI -->
              <div class="mb-8 text-center relative z-10">
                <p class="text-[0.65rem] text-gray-400 font-bold uppercase tracking-[0.2em] mb-2">Reportes Procesados</p>
                <div class="flex items-baseline justify-center gap-2">
                  <span class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] filter drop-shadow-[0_0_10px_rgba(0,243,255,0.3)]">2,845</span>
                  <span class="text-sm font-bold text-[var(--color-neon-green)]">↑ 14%</span>
                </div>
              </div>
              <!-- Mini Grid Stats -->
              <div class="grid grid-cols-2 gap-4 relative z-10">
                <div class="glass rounded-2xl p-4 border border-white/5 hover:border-[var(--color-neon-blue)]/30 transition-colors group">
                  <div class="flex justify-between items-start mb-2">
                    <span class="w-8 h-8 rounded-lg bg-[var(--color-neon-blue)]/10 flex items-center justify-center text-[var(--color-neon-blue)] text-lg group-hover:scale-110 transition-transform">🏥</span>
                    <span class="text-[0.6rem] text-gray-500 font-bold uppercase">Operativo</span>
                  </div>
                  <p class="text-[0.6rem] text-gray-400 uppercase tracking-widest font-bold mb-1">Centros CDI</p>
                  <p class="text-2xl font-black text-white">48</p>
                </div>
                <div class="glass rounded-2xl p-4 border border-white/5 hover:border-[var(--color-neon-pink)]/30 transition-colors group">
                  <div class="flex justify-between items-start mb-2">
                    <span class="w-8 h-8 rounded-lg bg-[var(--color-neon-pink)]/10 flex items-center justify-center text-[var(--color-neon-pink)] text-lg group-hover:scale-110 transition-transform">🚨</span>
                    <span class="text-[0.6rem] text-[var(--color-neon-pink)] font-bold uppercase animate-pulse">Alerta</span>
                  </div>
                  <p class="text-[0.6rem] text-gray-400 uppercase tracking-widest font-bold mb-1">Brotes Activos</p>
                  <p class="text-2xl font-black text-white">03</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Branding Section (Exact V3 Copy) -->
    <section id="branding" class="relative z-10 px-8 py-16">
      <div class="max-w-7xl mx-auto">
        <div class="glass-strong rounded-3xl p-8 lg:p-12 border border-white/10 overflow-hidden relative shadow-glass-lg">
          <div class="absolute top-0 right-0 w-96 h-96 bg-[var(--color-neon-blue)]/10 rounded-full blur-[100px]"></div>
          <div class="grid lg:grid-cols-12 gap-8 items-center relative">
            <div class="lg:col-span-4 flex justify-center lg:justify-start">
              <div class="relative">
                <div class="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-blue)] via-[var(--color-neon-purple)] to-[var(--color-neon-pink)] rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div class="relative w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-glass-lg">
                  <img src="/images/alcalde-carlos-guzman.png" alt="Carlos Guzmán" class="w-full h-full object-cover object-top scale-105">
                </div>
                <div class="absolute -inset-4 border-2 border-dashed border-[var(--color-neon-blue)]/30 rounded-full animate-spin-slow"></div>
              </div>
            </div>
            <div class="lg:col-span-8 text-center lg:text-left space-y-6">
              <div class="space-y-2">
                <p class="text-[var(--color-neon-blue)] font-semibold tracking-widest text-sm uppercase">Alcaldía del Municipio Santiago Mariño</p>
                <h3 class="font-display font-black text-4xl lg:text-6xl text-white leading-tight">Carlos Guzmán</h3>
                <div class="flex items-center justify-center lg:justify-start gap-4">
                  <div class="h-1 w-20 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] rounded-full"></div>
                  <p class="text-2xl lg:text-3xl font-bold text-gradient italic">Gente Que Resuelve</p>
                  <div class="h-1 w-20 bg-gradient-to-r from-[var(--color-neon-purple)] to-[var(--color-neon-pink)] rounded-full"></div>
                </div>
              </div>
              <p class="text-lg text-gray-300 max-w-2xl leading-relaxed">
                Comprometidos con la salud de nuestro municipio. Esta plataforma representa nuestra dedicación a modernizar los servicios de salud pública y garantizar el bienestar de todos los ciudadanos de Santiago Mariño.
              </p>
              
              <div class="flex items-center justify-center lg:justify-start gap-6 pt-4">
                <div class="glass px-8 py-6 rounded-3xl flex items-center justify-center bg-white/5 border border-white/10 hover:border-[var(--color-neon-blue)]/50 transition-all duration-500 overflow-hidden shadow-2xl">
                  <img src="/images/logo-marino.png" alt="Logo Santiago Mariño" class="h-28 md:h-32 object-contain filter drop-shadow-[0_0_15px_rgba(0,243,255,0.4)]">
                </div>
                <div class="text-left">
                  <p class="text-sm text-gray-400 uppercase tracking-widest font-bold">Municipio</p>
                  <p class="font-black text-3xl text-white tracking-tight leading-none">SANTIAGO MARIÑO</p>
                  <p class="text-[0.6rem] text-[var(--color-neon-green)] font-bold tracking-[0.3em] uppercase mt-2">Gente Que Resuelve</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- NEW: Jornadas Activas Section (V4 Feature injected structurally like V3) -->
    <section id="jornadas" class="relative z-10 px-8 py-20 bg-gradient-to-b from-transparent to-[var(--color-dark-800)]">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div class="text-center md:text-left">
            <p class="text-[var(--color-neon-pink)] font-semibold tracking-widest text-sm uppercase mb-2">Módulo V4 Integrado</p>
            <h3 class="font-display font-black text-4xl lg:text-5xl text-white">Jornadas <span class="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-pink)] to-[var(--color-neon-purple)]">Médicas</span></h3>
          </div>
          <router-link to="/login" class="btn-glass border-[var(--color-neon-pink)]/30 text-[var(--color-neon-pink)] hover:bg-[var(--color-neon-pink)]/10 text-xs px-6 py-3 uppercase tracking-widest">
            Ver Cronograma Completo →
          </router-link>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div class="glass-strong rounded-3xl p-6 border border-[var(--color-neon-green)]/20 hover:border-[var(--color-neon-green)]/60 transition-all group overflow-hidden relative">
            <div class="absolute top-0 right-0 w-32 h-32 bg-[var(--color-neon-green)]/10 rounded-full blur-[50px] group-hover:bg-[var(--color-neon-green)]/20 transition-all"></div>
            <div class="flex items-center justify-between mb-6 relative z-10">
              <span class="px-3 py-1 rounded-full bg-[var(--color-neon-green)]/10 text-[var(--color-neon-green)] text-[0.65rem] font-bold uppercase tracking-widest border border-[var(--color-neon-green)]/30">En Progreso</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">🩺</span>
            </div>
            <h4 class="text-xl font-bold text-white mb-2 relative z-10">Despistaje de Hipertensión</h4>
            <p class="text-sm text-gray-400 mb-6 relative z-10">Plaza Bolívar, Turmero. Atención primaria y entrega de medicamentos.</p>
            
            <div class="glass rounded-2xl p-4 border border-white/5 flex items-center justify-between relative z-10">
              <div class="text-left">
                <p class="text-[0.6rem] text-gray-500 uppercase font-black tracking-widest">Atendidos</p>
                <p class="text-lg font-black text-[var(--color-neon-green)]">142<span class="text-xs text-gray-400 font-normal">/300</span></p>
              </div>
              <div class="w-12 h-12 rounded-full border-2 border-[var(--color-neon-green)]/30 border-t-[var(--color-neon-green)] animate-spin flex items-center justify-center">
                 <span class="w-8 h-8 rounded-full bg-[var(--color-neon-green)]/10"></span>
              </div>
            </div>
          </div>

          <div class="glass-strong rounded-3xl p-6 border border-[var(--color-neon-blue)]/20 hover:border-[var(--color-neon-blue)]/60 transition-all group overflow-hidden relative">
            <div class="absolute top-0 right-0 w-32 h-32 bg-[var(--color-neon-blue)]/10 rounded-full blur-[50px] group-hover:bg-[var(--color-neon-blue)]/20 transition-all"></div>
            <div class="flex items-center justify-between mb-6 relative z-10">
              <span class="px-3 py-1 rounded-full bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-blue)] text-[0.65rem] font-bold uppercase tracking-widest border border-[var(--color-neon-blue)]/30">Próximamente</span>
              <span class="text-2xl group-hover:scale-110 transition-transform">💉</span>
            </div>
            <h4 class="text-xl font-bold text-white mb-2 relative z-10">Vacunación Las Américas</h4>
            <p class="text-sm text-gray-400 mb-6 relative z-10">CDI Valle Lindo. Refuerzos COVID y esquema nacional.</p>
            
            <div class="glass rounded-2xl p-4 border border-white/5 flex flex-col gap-2 relative z-10">
              <div class="flex justify-between items-center text-[0.65rem] uppercase font-black tracking-widest">
                <span class="text-gray-500">Preparación</span>
                <span class="text-[var(--color-neon-blue)]">80%</span>
              </div>
              <div class="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-[var(--color-neon-blue)] rounded-full w-[80%] shadow-[0_0_10px_rgba(0,243,255,0.5)]"></div>
              </div>
            </div>
          </div>

          <div class="glass-strong rounded-3xl p-6 border border-gray-600/30 hover:border-gray-500/50 transition-all group overflow-hidden relative opacity-70 hover:opacity-100">
            <div class="flex items-center justify-between mb-6">
              <span class="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-[0.65rem] font-bold uppercase tracking-widest border border-white/10">Finalizada</span>
              <span class="text-2xl filter grayscale group-hover:grayscale-0 transition-all">🦷</span>
            </div>
            <h4 class="text-xl font-bold text-gray-300 mb-2">Jornada Odontológica</h4>
            <p class="text-sm text-gray-500 mb-6">Ambulatorio Turmero. Limpiezas y diagnósticos pediátricos.</p>
            
            <div class="flex gap-2">
              <div class="flex-1 glass rounded-xl p-3 text-center border border-white/5">
                <p class="text-[0.6rem] text-gray-400 uppercase font-black tracking-widest mb-1">Impacto</p>
                <p class="text-lg font-bold text-white">450 <span class="text-xs text-gray-500">Pacientes</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="relative z-10 px-8 py-20">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <p class="text-[var(--color-neon-blue)] font-semibold tracking-widest text-sm uppercase mb-4">Características</p>
          <h3 class="font-display font-black text-4xl lg:text-5xl text-white mb-4">Eficiencia en <span class="text-gradient">Salud Pública</span></h3>
          <p class="text-gray-400 max-w-2xl mx-auto">Diseñado para la agilidad técnica del personal médico y la claridad estratégica de la gestión pública.</p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(feat, i) in features" :key="i" class="card-glass group hover:-translate-y-2">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-neon-blue)]/20 to-[var(--color-neon-purple)]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-all border border-white/10" style="box-shadow: 0 0 20px rgba(0,243,255,0.3)">
              <span class="text-3xl text-[var(--color-neon-blue)] drop-shadow-glow">{{ feat.icon }}</span>
            </div>
            <h4 class="text-xl font-bold text-white mb-3">{{ feat.title }}</h4>
            <p class="text-gray-400 leading-relaxed">{{ feat.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Templates Section -->
    <section id="templates" class="relative z-10 px-8 py-20 bg-white/[0.02]">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h3 class="font-display font-black text-4xl lg:text-5xl text-white mb-4">Plantillas Oficiales <span class="text-gradient">MPPS</span></h3>
          <p class="text-gray-400">Reportes digitalizados bajo normativa nacional.</p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(temp, i) in templates" :key="i" class="glass rounded-2xl p-6 border border-white/10 hover:border-[var(--color-neon-blue)]/50 transition-all group">
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl drop-shadow-glow group-hover:scale-110 transition-transform">
                {{ temp.icon }}
              </div>
              <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" :style="{ backgroundColor: temp.bg, color: temp.color, borderColor: temp.border }">
                {{ temp.badge }}
              </span>
            </div>
            <h4 class="text-lg font-bold text-white mb-2">{{ temp.name }}</h4>
            <p class="text-sm text-gray-400 mb-4">{{ temp.description }}</p>
            <div class="flex items-center gap-2 text-[var(--color-neon-blue)] text-sm font-medium group-hover:gap-4 transition-all uppercase tracking-widest font-black">
              <span>Probar Formato</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative z-10 px-8 py-12 border-t border-white/10 bg-[var(--color-dark-900)]">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] flex items-center justify-center">
            <span class="text-xl">🏥</span>
          </div>
          <div>
            <h4 class="font-display font-bold text-lg text-gradient leading-tight">MediReport</h4>
            <p class="text-[0.6rem] text-gray-500 uppercase tracking-widest font-black">Pro V4 · 2026 Edition</p>
          </div>
        </div>
        <div class="flex gap-8 text-xs text-gray-500 uppercase font-black tracking-widest">
          <a href="#" class="hover:text-[var(--color-neon-blue)] transition-colors">Términos</a>
          <a href="#" class="hover:text-[var(--color-neon-blue)] transition-colors">Privacidad</a>
          <a href="#" class="hover:text-[var(--color-neon-blue)] transition-colors">Soporte</a>
        </div>
        <p class="text-gray-600 text-[0.65rem] font-bold uppercase tracking-widest">© 2026 Alcaldía de Santiago Mariño. Gente Que Resuelve.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const features = [
  { icon: '⚡', title: 'Reportes Rápidos', description: 'Completa tus reportes en minutos con plantillas intuitivas y autocompletado inteligente.' },
  { icon: '📊', title: 'Inteligencia de Datos', description: 'Visualice la carga epidemiológica en tiempo real con dashboards interactivos.' },
  { icon: '🔔', title: 'Sistema de Alertas', description: 'Notificaciones críticas inmediatas sobre brotes o resoluciones ministeriales.' },
  { icon: '👥', title: 'Gestión de Personal', description: 'Monitoreo dinámico del cumplimiento y productividad de los ASIC.' },
  { icon: '📱', title: 'WhatsApp Directo', description: 'Canal de comunicación directo con coordinadores para seguimiento operativo.' },
  { icon: '🔒', title: 'Seguridad Militar', description: 'Encriptación de grado bancario para proteger la confidencialidad del paciente.' }
]

const templates = [
  { icon: '📋', name: 'Morbilidad Diaria', description: 'Registro diario estandarizado MPPS.', badge: 'Diario', bg: 'rgba(0,243,255,0.2)', color: 'var(--color-neon-blue)', border: '1px solid rgba(0,243,255,0.3)' },
  { icon: '🚨', name: 'Notificación Inmediata', description: 'Alertas tempranas epidemiológicas.', badge: 'Urgente', bg: 'rgba(255,0,234,0.2)', color: 'var(--color-neon-pink)', border: '1px solid rgba(255,0,234,0.3)' },
  { icon: '🏥', name: 'Estadística CDI', description: 'Consolidado de servicios especializados.', badge: 'CDI', bg: 'rgba(0,255,157,0.2)', color: 'var(--color-neon-green)', border: '1px solid rgba(0,255,157,0.3)' },
  { icon: '📈', name: 'Gestión Comunal', description: 'Actividades preventivas en territorio.', badge: 'Comunal', bg: 'rgba(188,19,254,0.2)', color: 'var(--color-neon-purple)', border: '1px solid rgba(188,19,254,0.3)' }
]
</script>

<style scoped>
@reference "tailwindcss";

.drop-shadow-glow {
  filter: drop-shadow(0 0 8px rgba(0, 243, 255, 0.4));
}

.shadow-glass-lg {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.animate-spin-slow {
  animation: spin 30s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Ensure font-display uses consistent family from V3 */
.font-display {
  font-family: 'Space Grotesk', system-ui, sans-serif;
}
</style>
