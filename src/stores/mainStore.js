import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { InsForgeService } from '../services/insforgeApi'

// ============================================
// CONSTANTES DEL SISTEMA
// ============================================
export const USER_ROLES = {
  ADMIN: 'administrador',
  COORD: 'coordinador',
  DOCTOR: 'doctor',
  ENFERMERO: 'enfermero'
}

export const CENTROS_SALUD = [
  'Hospital Central',
  'CDI Los Robles',
  'CPT Saman de Guere',
  'CPT Ernesto Che Guevara',
  'SRI Bella Vista',
  'CAT La Carpiera'
]

export const ASIC_LIST = [
  'SAMAN DE GUERE', 'COOPERATIVA', 'MADRE MARIA', 'MANUEL ATANACIO GIRARDOT',
  'LAS ACACIAS', 'LOS COCOS', 'DR JOSE GREGORIO HERNANDEZ', 'ALAYON',
  'LOSTACARIGUA', 'CAÑA DE AZUCAR', 'CASA SOLIDARIA', 'LA CANDELARIA',
  'COSTA DE ORO', 'LAMAS SANTA CRUZ', 'PALO NEGRO', 'SANTA ANA',
  'LUISA CACERES DE ARISMENDI', 'SANTA INES', 'SOLIDARIDAD SOCIAL',
  'LA FUNDACION', 'BELLA VISTA', 'LA CARPIERA', 'LA SEGUNDERA',
  'TAMBORITO', 'ADUANA', 'ANCA', 'VALLE LINDO', 'EL TIERRAL',
  'ROSARIO DE PAYA', 'DR GILBERTO RODRIGUEZ', 'FRANCISCO DE MIRANDA',
  'CASTOR NIEVES RIOS', 'VISTORIA', 'ZUATA', 'ERNESTO CHE GUEVARA REVENGA',
  'NEGRA HIPOLITA', 'SANTOS MICHELENA', 'TOVAR', 'SAN SEBASTIAN',
  'SAN CASIMIRO', 'CAMATAGUA', 'URDANETA', 'EJE COSTERO'
]

export const TIPO_JORNADA_OPTIONS = [
  'despistaje', 'vacunacion', 'amor_en_accion', 'integral', 'charla'
]

// ============================================
// STORE PRINCIPAL
// ============================================
// Helper for UUIDs
const generateUUID = () => {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

export const useMainStore = defineStore('main', () => {

  // ─── STATE ───────────────────────────────
  const currentUser = ref(null)
  const sidebarCollapsed = ref(false)
  const notifications = ref([]) // Toast notifications
  const sessionToken = ref(null)
  const sessionExpiry = ref(null)
  const deepAuditLog = ref(loadFromStorage('v4_deep_audit', []))
  const archivedReports = ref(loadFromStorage('v4_archived_reports', []))

  // ─── USERS ───────────────────────────────
  const users = ref(
    loadFromStorage('v4_users', [
      { id: '1', name: 'Admin del Sistema', email: 'admin', password: 'admin123', role: USER_ROLES.ADMIN, avatar: '🛡️', specialty: 'Administración', center: 'Alcaldía Santiago Mariño', asic: 'SAMAN DE GUERE', phone: '+58 412-1234567', cedula: 'V-12345678', isActive: true, createdAt: '2024-01-15T08:00:00' },
      { id: '2', name: 'Dra. María González', email: 'maria.gonzalez@hospital.com', password: 'coord123', role: USER_ROLES.COORD, avatar: '👩‍⚕️', specialty: 'Medicina Interna', center: 'Hospital Central', asic: 'SAMAN DE GUERE', phone: '+58 414-7654321', cedula: 'V-87654321', isActive: true, createdAt: '2024-02-01T09:00:00' },
      { id: '3', name: 'Dr. Carlos Rodríguez', email: 'carlos.rodriguez@cdi.com', password: 'doctor123', role: USER_ROLES.DOCTOR, avatar: '👨‍⚕️', specialty: 'Medicina General', center: 'CDI Los Robles', asic: 'LOS COCOS', phone: '+58 416-9876543', cedula: 'V-11223344', isActive: true, createdAt: '2024-02-15T10:00:00' },
      { id: '4', name: 'Enf. Ana Martínez', email: 'ana.martinez@cdi.com', password: 'doctor123', role: USER_ROLES.ENFERMERO, avatar: '💉', specialty: 'Enfermería General', center: 'CDI Los Robles', asic: 'LOS COCOS', phone: '+58 424-1122334', cedula: 'V-33445566', isActive: true, createdAt: '2024-03-01T08:30:00' },
      { id: '5', name: 'Dr. Luis Pérez', email: 'luis.perez@hospital.com', password: 'doctor123', role: USER_ROLES.DOCTOR, avatar: '👨‍⚕️', specialty: 'Pediatría', center: 'Hospital Central', asic: 'SAMAN DE GUERE', phone: '+58 412-5566778', cedula: 'V-55667788', isActive: true, createdAt: '2024-03-10T11:00:00' },
      { id: '6', name: 'Enf. Carmen Sánchez', email: 'carmen.sanchez@hospital.com', password: 'doctor123', role: USER_ROLES.ENFERMERO, avatar: '👩‍⚕️', specialty: 'Cuidados Intensivos', center: 'Hospital Central', asic: 'MADRE MARIA', phone: '+58 416-4455667', cedula: 'V-66778899', isActive: true, createdAt: '2024-04-01T07:00:00' }
    ])
  )

  // ─── REPORTS ─────────────────────────────
  const reports = ref(
    loadFromStorage('v4_reports', [
      { id: 'r1', tipo: 'morbilidad', semana: 9, fecha: new Date().toISOString().slice(0, 10), centroSalud: 'CDI Los Robles', asic: 'LOS COCOS', estado: 'completado', createdByUserId: '3', createdByName: 'Dr. Carlos Rodríguez', datos: { emergencias: 45, consultas: 120, vidasSalvadas: 2, hospitalizaciones: 8 }, createdAt: new Date().toISOString(), auditLog: [{ action: 'created', by: 'Dr. Carlos Rodríguez', at: new Date().toISOString() }] },
      { id: 'r2', tipo: 'cdi', semana: 9, fecha: new Date(Date.now() - 86400000).toISOString().slice(0, 10), centroSalud: 'CDI Los Robles', asic: 'LOS COCOS', estado: 'completado', createdByUserId: '3', createdByName: 'Dr. Carlos Rodríguez', datos: { consultas: 80, despistajes: 25, inmunizaciones: 40, planificacion: 15 }, createdAt: new Date(Date.now() - 86400000).toISOString(), auditLog: [] },
      { id: 'r3', tipo: 'morbilidad', semana: 9, fecha: new Date().toISOString().slice(0, 10), centroSalud: 'Hospital Central', asic: 'SAMAN DE GUERE', estado: 'borrador', createdByUserId: '2', createdByName: 'Dra. María González', datos: { emergencias: 30, consultas: 95, vidasSalvadas: 1, hospitalizaciones: 5 }, createdAt: new Date().toISOString(), auditLog: [] },
      { id: 'r4', tipo: 'accion_comunal', semana: 8, fecha: new Date(Date.now() - 172800000).toISOString().slice(0, 10), centroSalud: 'CPT Saman de Guere', asic: 'COOPERATIVA', estado: 'completado', createdByUserId: '5', createdByName: 'Dr. Luis Pérez', datos: { personasAtendidas: 200, adultosMayores: 45, discapacitados: 12, oncologicos: 3 }, createdAt: new Date(Date.now() - 172800000).toISOString(), auditLog: [] },
      { id: 'r5', tipo: 'mortalidad', semana: 8, fecha: new Date(Date.now() - 259200000).toISOString().slice(0, 10), centroSalud: 'Hospital Central', asic: 'SAMAN DE GUERE', estado: 'completado', createdByUserId: '2', createdByName: 'Dra. María González', datos: { defunciones: 2, perinatales: 0, maternas: 0, causas: 'Insuficiencia cardíaca' }, createdAt: new Date(Date.now() - 259200000).toISOString(), auditLog: [] },
    ])
  )

  // ─── JORNADAS ────────────────────────────
  const jornadas = ref(
    loadFromStorage('v4_jornadas', [
      { id: 'j1', nombre: 'Jornada de Despistaje de Cáncer', tipo: 'despistaje', fecha: new Date().toISOString().slice(0, 10), ubicacion: 'Plaza Bolívar', comunidad: 'Saman de Guere', asic: 'SAMAN DE GUERE', responsableId: '2', responsableNombre: 'Dra. María González', participantes: ['Enf. Ana Martínez', 'Dr. Luis Pérez'], indicadores: { despistajecaMama: 15, despistajecaCuello: 20, despistajecaProstata: 10, positivos: 2 }, observaciones: 'Buena asistencia', estado: 'finalizada', createdAt: new Date().toISOString() },
      { id: 'j2', nombre: 'Jornada de Vacunación Masiva', tipo: 'vacunacion', fecha: new Date(Date.now() + 86400000).toISOString().slice(0, 10), ubicacion: 'CDI Los Robles', comunidad: 'Los Cocos', asic: 'LOS COCOS', responsableId: '3', responsableNombre: 'Dr. Carlos Rodríguez', participantes: ['Enf. Carmen Sánchez'], indicadores: { vacunasAplicadas: 0, personasVacunadas: 0 }, observaciones: '', estado: 'programada', createdAt: new Date().toISOString() },
      { id: 'j3', nombre: 'Amor en Acción Comunidad El Carmen', tipo: 'amor_en_accion', fecha: new Date().toISOString().slice(0, 10), ubicacion: 'Comunidad El Carmen', comunidad: 'El Carmen', asic: 'MADRE MARIA', responsableId: '2', responsableNombre: 'Dra. María González', participantes: ['Enf. Ana Martínez', 'Enf. Carmen Sánchez', 'Dr. Luis Pérez'], indicadores: { personasAtendidas: 45, adultosMayores: 12, discapacitados: 3, oncologicos: 1 }, observaciones: 'Excelente participación', estado: 'en_curso', createdAt: new Date().toISOString() }
    ])
  )

  // ─── ALERTS ──────────────────────────────
  const alerts = ref(
    loadFromStorage('v4_alerts', [
      { id: 'a1', titulo: 'Alerta Epidemiológica - Dengue', mensaje: 'Se reporta aumento de casos de dengue en el municipio. Reforzar medidas de vigilancia.', tipo: 'urgent', prioridad: 'alta', emitidaPor: 'Admin del Sistema', emitidaPorId: '1', fecha: new Date().toISOString(), leida: false, leidaPor: [] },
      { id: 'a2', titulo: 'Nuevo Formato MPPS Disponible', mensaje: 'Se actualizó el formato de reporte según la resolución 2024-089 del MPPS.', tipo: 'info', prioridad: 'media', emitidaPor: 'Dra. María González', emitidaPorId: '2', fecha: new Date().toISOString(), leida: false, leidaPor: [] },
      { id: 'a3', titulo: 'Mantenimiento Programado', mensaje: 'El sistema estará en mantenimiento este sábado de 2:00 AM a 6:00 AM.', tipo: 'warning', prioridad: 'baja', emitidaPor: 'Admin del Sistema', emitidaPorId: '1', fecha: new Date(Date.now() - 86400000).toISOString(), leida: true, leidaPor: ['3', '4', '5'] }
    ])
  )

  // ─── PERMISSION GETTERS ──────────────────
  const isAdmin = computed(() => currentUser.value?.role === USER_ROLES.ADMIN)
  const isCoordinador = computed(() => currentUser.value?.role === USER_ROLES.COORD)
  const isAdminOrCoord = computed(() => isAdmin.value || isCoordinador.value)
  const canViewTotals = computed(() => isAdminOrCoord.value)
  const canDownloadReports = computed(() => isAdminOrCoord.value)
  const canCreateAlerts = computed(() => isAdminOrCoord.value)
  const canManageUsers = computed(() => isAdminOrCoord.value)
  const canManageJornadas = computed(() => isAdminOrCoord.value)

  // ─── DASHBOARD STATS ────────────────────
  const getDashboardStats = computed(() => {
    const today = new Date().toISOString().slice(0, 10)
    const myReports = currentUser.value
      ? (isAdminOrCoord.value
        ? reports.value
        : reports.value.filter(r => r.createdByUserId === currentUser.value.id))
      : []
    return {
      totalReportes: myReports.length,
      reportesHoy: myReports.filter(r => r.fecha === today).length,
      reportesPendientes: myReports.filter(r => r.estado === 'borrador').length,
      jornadasActivas: jornadas.value.filter(j => j.estado === 'en_curso').length,
      personalActivo: users.value.filter(u => u.isActive).length,
      reportsByMonth: Array.from({ length: 12 }, (_, i) => ({
        month: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][i],
        count: reports.value.filter(r => new Date(r.fecha).getMonth() === i).length
      })),
      reportsByType: {
        morbilidad: reports.value.filter(r => r.tipo === 'morbilidad').length,
        mortalidad: reports.value.filter(r => r.tipo === 'mortalidad').length,
        cdi: reports.value.filter(r => r.tipo === 'cdi').length,
        accion_comunal: reports.value.filter(r => r.tipo === 'accion_comunal').length,
        especialidad: reports.value.filter(r => r.tipo === 'especialidad').length,
      }
    }
  })

  const getUnreadAlerts = computed(() => alerts.value.filter(a => !a.leida))

  const getDoctorTrackingStatuses = computed(() => {
    const today = new Date().toISOString().slice(0, 10)
    if (!users.value || !reports.value) return []
    return users.value
      .filter(u => u && (u.role === USER_ROLES.DOCTOR || u.role === USER_ROLES.ENFERMERO))
      .map(u => {
        const userReports = reports.value.filter(r => r.createdByUserId === u.id)
        const todayReport = userReports.find(r => r.fecha === today)
        const thisMonth = userReports.filter(r => {
          const d = new Date(r.fecha)
          const now = new Date()
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        })
        return {
          userId: u.id, name: u.name, role: u.role,
          specialty: u.specialty, phone: u.phone, center: u.center, asic: u.asic,
          hasReportedToday: !!todayReport,
          lastReportDate: userReports.length > 0 ? userReports[0].createdAt : null,
          totalReportsThisMonth: thisMonth.length
        }
      })
  })

  // ─── VISIBILLITY FOR DOCTOR/ENFERMERO ───
  const getMyReports = computed(() => {
    if (!currentUser.value) return []
    if (isAdminOrCoord.value) return reports.value
    return reports.value.filter(r => r.createdByUserId === currentUser.value.id)
  })

  // ─── JORNADA COMPUTED ────────────────────
  const jornadasActivas = computed(() => jornadas.value.filter(j => j.estado === 'en_curso'))
  const jornadasProgramadas = computed(() => jornadas.value.filter(j => j.estado === 'programada'))
  const jornadasFinalizadas = computed(() => jornadas.value.filter(j => j.estado === 'finalizada'))

  // ─── ACTIONS ─────────────────────────────
  async function login(email, password) {
    // SIEMPRE sincronizar con InsForge antes de verificar credenciales
    try {
      await syncWithInsForge()
    } catch (e) {
      console.warn('Error syncing before login, using local data:', e)
    }

    const user = users.value.find(u => u.email === email && u.password === password)
    if (user) {
      currentUser.value = { ...user }
      localStorage.setItem('v4_current_user', JSON.stringify(user))
      // V5: JWT-like session with expiry
      const token = 'jwt_' + btoa(JSON.stringify({ uid: user.id, iat: Date.now() }))
      sessionToken.value = token
      sessionExpiry.value = Date.now() + (8 * 60 * 60 * 1000) // 8 hours
      localStorage.setItem('v4_session_token', token)
      localStorage.setItem('v4_session_expiry', sessionExpiry.value.toString())
      logDeepAudit('session', 'login', null, { userId: user.id, name: user.name })
      // Si es clave temporal, indicar que debe cambiar
      if (user.mustChangePassword) return 'change_password'
      return true
    }
    return false
  }

  function logout() {
    logDeepAudit('session', 'logout', null, { userId: currentUser.value?.id })
    currentUser.value = null
    sessionToken.value = null
    sessionExpiry.value = null
    localStorage.removeItem('v4_current_user')
    localStorage.removeItem('v4_session_token')
    localStorage.removeItem('v4_session_expiry')
  }

  function isSessionValid() {
    if (!sessionExpiry.value) return false
    if (Date.now() > sessionExpiry.value) {
      addNotification('Sesión expirada. Por favor inicie sesión de nuevo.', 'warning')
      logout()
      return false
    }
    return true
  }

  function refreshSession() {
    if (currentUser.value) {
      sessionExpiry.value = Date.now() + (8 * 60 * 60 * 1000)
      localStorage.setItem('v4_session_expiry', sessionExpiry.value.toString())
    }
  }

  function initFromStorage() {
    const saved = localStorage.getItem('v4_current_user')
    if (saved) {
      currentUser.value = JSON.parse(saved)
      // V5: Restore session token
      sessionToken.value = localStorage.getItem('v4_session_token')
      const expiry = localStorage.getItem('v4_session_expiry')
      sessionExpiry.value = expiry ? parseInt(expiry) : null
      // Check session validity
      if (sessionExpiry.value && Date.now() > sessionExpiry.value) {
        logout()
        return
      }
      // Initiate background sync with InsForge
      syncWithInsForge()
    }
  }

  async function syncWithInsForge() {
    try {
      console.log('🔄 Sincronizando con InsForge...')
      const [fUsers, fReports, fJornadas, fAlerts] = await Promise.all([
        InsForgeService.getUsers().catch(e => { console.error('Error Users:', e); return [] }),
        InsForgeService.getReports().catch(e => { console.error('Error Reports:', e); return [] }),
        InsForgeService.getJornadas().catch(e => { console.error('Error Jornadas:', e); return [] }),
        InsForgeService.getAlerts().catch(e => { console.error('Error Alerts:', e); return [] })
      ])
      console.log('📊 Datos recibidos:', { fUsers, fReports, fJornadas, fAlerts })

      // Update local state if remote data exists
      if (fUsers && fUsers.length > 0) {
        users.value = fUsers
        saveToStorage('v4_users', users.value)
      }
      if (fReports && fReports.length > 0) {
        reports.value = fReports
        saveToStorage('v4_reports', reports.value)
      }
      if (fJornadas && fJornadas.length > 0) {
        jornadas.value = fJornadas
        saveToStorage('v4_jornadas', jornadas.value)
      }
      if (fAlerts && fAlerts.length > 0) {
        alerts.value = fAlerts
        saveToStorage('v4_alerts', alerts.value)
      }
    } catch (e) {
      console.error('Error syncing with InsForge:', e)
    }
  }

  async function forceCloudPush() {
    // Utility for the admin to push all existing local dummy data to the new cloud DB
    try {
      addNotification('Subiendo datos locales a InsForge...', 'info')
      for (const u of users.value) await InsForgeService.createUser(u).catch(() => { })
      for (const r of reports.value) await InsForgeService.createReport(r).catch(() => { })
      for (const j of jornadas.value) await InsForgeService.createJornada(j).catch(() => { })
      for (const a of alerts.value) await InsForgeService.createAlert(a).catch(() => { })
      addNotification('Carga a la nube completada', 'success')
    } catch (e) {
      addNotification('Error al subir datos', 'danger')
    }
  }

  function toggleSidebar() { sidebarCollapsed.value = !sidebarCollapsed.value }

  // ─── V5: DIGITAL SIGNATURES ─────────────
  async function signReport(reportId, pin) {
    const idx = reports.value.findIndex(r => r.id === reportId)
    if (idx === -1) return false
    if (!currentUser.value) return false
    // Create a hash-based digital signature
    const payload = JSON.stringify({
      reportId, userId: currentUser.value.id, userName: currentUser.value.name,
      datos: reports.value[idx].datos, timestamp: new Date().toISOString(), pin
    })
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload))
    const signature = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
    reports.value[idx].firma = {
      signedBy: currentUser.value.name, signedById: currentUser.value.id,
      signedAt: new Date().toISOString(), signatureHash: signature, verified: true
    }
    reports.value[idx].estado = 'completado'
    saveToStorage('v4_reports', reports.value)
    InsForgeService.updateReport(reportId, reports.value[idx]).catch(e => console.error('InsForge error:', e))
    logDeepAudit('report', 'digital_sign', reportId, { signedBy: currentUser.value.name, hash: signature.slice(0, 16) + '...' })
    addNotification('Reporte firmado digitalmente ✅', 'success')
    return true
  }

  // ─── V5: DEEP AUDIT LOG ─────────────────
  function logDeepAudit(entity, action, entityId, details = {}) {
    const entry = {
      id: 'audit_' + Date.now(),
      entity, action, entityId,
      userId: currentUser.value?.id || 'system',
      userName: currentUser.value?.name || 'Sistema',
      timestamp: new Date().toISOString(),
      details
    }
    deepAuditLog.value.unshift(entry)
    if (deepAuditLog.value.length > 500) deepAuditLog.value = deepAuditLog.value.slice(0, 500)
    saveToStorage('v4_deep_audit', deepAuditLog.value)
  }

  function trackFieldChanges(entity, entityId, oldData, newData) {
    const changes = {}
    for (const key of Object.keys(newData)) {
      if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
        changes[key] = { from: oldData[key], to: newData[key] }
      }
    }
    if (Object.keys(changes).length > 0) {
      logDeepAudit(entity, 'field_change', entityId, changes)
    }
  }

  // ─── V5: GEOLOCATION FOR JORNADAS ───────
  function captureGeolocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) { resolve(null); return }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000 }
      )
    })
  }

  // ─── V5: ARCHIVE OLD REPORTS ─────────────
  function archiveOldReports(olderThanMonths = 12) {
    const cutoff = new Date()
    cutoff.setMonth(cutoff.getMonth() - olderThanMonths)
    const toArchive = reports.value.filter(r => new Date(r.fecha) < cutoff)
    if (toArchive.length === 0) { addNotification('No hay reportes antiguos para archivar', 'info'); return }
    archivedReports.value.push(...toArchive)
    reports.value = reports.value.filter(r => new Date(r.fecha) >= cutoff)
    saveToStorage('v4_reports', reports.value)
    saveToStorage('v4_archived_reports', archivedReports.value)
    logDeepAudit('system', 'archive', null, { count: toArchive.length, cutoffDate: cutoff.toISOString() })
    addNotification(`${toArchive.length} reportes archivados exitosamente`, 'success')
  }

  // Reports
  function addReport(reportData) {
    const report = {
      ...reportData,
      id: generateUUID(),
      createdAt: new Date().toISOString(),
      auditLog: [{ action: 'created', by: currentUser.value?.name, at: new Date().toISOString() }]
    }
    reports.value.unshift(report)
    saveToStorage('v4_reports', reports.value)
    InsForgeService.createReport(report).catch(e => console.error('InsForge error:', e))
    addNotification('Reporte creado exitosamente', 'success')
    return report
  }

  function updateReport(id, data) {
    const idx = reports.value.findIndex(r => r.id === id)
    if (idx !== -1) {
      // V5: Deep audit field tracking
      trackFieldChanges('report', id, reports.value[idx], data)
      reports.value[idx] = { ...reports.value[idx], ...data, updatedAt: new Date().toISOString() }
      if (!reports.value[idx].auditLog) reports.value[idx].auditLog = []
      reports.value[idx].auditLog.push({ action: 'updated', by: currentUser.value?.name, at: new Date().toISOString() })
      saveToStorage('v4_reports', reports.value)
      InsForgeService.updateReport(id, reports.value[idx]).catch(e => console.error('InsForge error:', e))
    }
  }

  function deleteReport(id) {
    reports.value = reports.value.filter(r => r.id !== id)
    saveToStorage('v4_reports', reports.value)
    InsForgeService.deleteReport(id).catch(e => console.error('InsForge error:', e))
    addNotification('Reporte eliminado', 'info')
  }

  // Jornadas
  async function addJornada(jornadaData) {
    // V5: Auto-capture geolocation
    const geo = await captureGeolocation()
    const jornada = { ...jornadaData, id: generateUUID(), estado: 'programada', participantes: [], createdAt: new Date().toISOString(), geoLocation: geo }
    jornadas.value.unshift(jornada)
    saveToStorage('v4_jornadas', jornadas.value)
    InsForgeService.createJornada(jornada).catch(e => console.error('InsForge error:', e))
    logDeepAudit('jornada', 'created', jornada.id, { nombre: jornada.nombre, geo })
    addNotification(geo ? 'Jornada creada con ubicación GPS ✅' : 'Jornada creada exitosamente', 'success')
    return jornada
  }

  function updateJornadaEstado(id, estado) {
    const idx = jornadas.value.findIndex(j => j.id === id)
    if (idx !== -1) {
      jornadas.value[idx].estado = estado
      jornadas.value[idx].updatedAt = new Date().toISOString()
      saveToStorage('v4_jornadas', jornadas.value)
      InsForgeService.updateJornada(id, jornadas.value[idx]).catch(e => console.error('InsForge error:', e))
    }
  }

  function deleteJornada(id) {
    jornadas.value = jornadas.value.filter(j => j.id !== id)
    saveToStorage('v4_jornadas', jornadas.value)
    InsForgeService.deleteJornada(id).catch(e => console.error('InsForge error:', e))
    addNotification('Jornada eliminada', 'info')
  }

  // Alerts
  function addAlert(alertData) {
    const alert = { ...alertData, id: 'a' + Date.now(), fecha: new Date().toISOString(), leida: false, leidaPor: [], emitidaPor: currentUser.value?.name, emitidaPorId: currentUser.value?.id }
    alerts.value.unshift(alert)
    saveToStorage('v4_alerts', alerts.value)
    InsForgeService.createAlert(alert).catch(e => console.error('InsForge error:', e))
    addNotification('Alerta enviada exitosamente', 'success')
  }

  function markAlertRead(id) {
    const a = alerts.value.find(a => a.id === id)
    if (a) {
      a.leida = true
      if (!a.leidaPor.includes(currentUser.value?.id)) a.leidaPor.push(currentUser.value?.id)
      saveToStorage('v4_alerts', alerts.value)
      InsForgeService.updateAlert(id, a).catch(e => console.error('InsForge error:', e))
    }
  }

  function markAllAlertsRead() {
    alerts.value.forEach(a => {
      a.leida = true
      if (currentUser.value?.id && !a.leidaPor?.includes(currentUser.value.id)) {
        if (!a.leidaPor) a.leidaPor = []
        a.leidaPor.push(currentUser.value.id)
      }
    })
    saveToStorage('v4_alerts', alerts.value)
  }

  // Users
  function addUser(userData) {
    const newUser = {
      ...userData,
      id: generateUUID(),
      isActive: true,
      mustChangePassword: userData.mustChangePassword || false,
      createdAt: new Date().toISOString()
    }
    users.value.push(newUser)
    saveToStorage('v4_users', users.value)
    InsForgeService.createUser(newUser).catch(e => console.error('InsForge error:', e))
    addNotification('Usuario creado exitosamente', 'success')
  }

  function updateUser(id, data) {
    const idx = users.value.findIndex(u => u.id === id)
    if (idx !== -1) {
      users.value[idx] = { ...users.value[idx], ...data }
      if (currentUser.value?.id === id) {
        currentUser.value = { ...users.value[idx] }
        localStorage.setItem('v4_current_user', JSON.stringify(currentUser.value))
      }
      saveToStorage('v4_users', users.value)
      InsForgeService.updateUser(id, users.value[idx]).catch(e => console.error('InsForge error:', e))
    }
  }

  function deleteUser(id) {
    users.value = users.value.filter(u => u.id !== id)
    saveToStorage('v4_users', users.value)
    InsForgeService.deleteUser(id).catch(e => console.error('InsForge error:', e))
    addNotification('Usuario eliminado', 'info')
  }

  function contactViaWhatsApp(phone, message) {
    const clean = phone.replace(/\D/g, '')
    const url = `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  // UI Notifications (toasts)
  function addNotification(message, type = 'info') {
    const id = 'n' + Date.now()
    notifications.value.push({ id, message, type })
    setTimeout(() => {
      notifications.value = notifications.value.filter(n => n.id !== id)
    }, 4000)
  }

  return {
    // State
    currentUser, sidebarCollapsed, users, reports, jornadas, alerts, notifications,
    sessionToken, sessionExpiry, deepAuditLog, archivedReports,
    // Constants (exported for templates)
    CENTROS_SALUD, ASIC_LIST, USER_ROLES, TIPO_JORNADA_OPTIONS,
    // Permission getters
    isAdmin, isCoordinador, isAdminOrCoord,
    canViewTotals, canDownloadReports, canCreateAlerts, canManageUsers, canManageJornadas,
    // Data getters
    getDashboardStats, getUnreadAlerts, getDoctorTrackingStatuses, getMyReports,
    jornadasActivas, jornadasProgramadas, jornadasFinalizadas,
    // Actions
    login, logout, initFromStorage, toggleSidebar, syncWithInsForge, forceCloudPush,
    isSessionValid, refreshSession,
    addReport, updateReport, deleteReport, signReport,
    addJornada, updateJornadaEstado, deleteJornada,
    addAlert, markAlertRead, markAllAlertsRead,
    addUser, updateUser, deleteUser,
    contactViaWhatsApp, addNotification,
    // V5
    logDeepAudit, captureGeolocation, archiveOldReports
  }
})

// ─── HELPERS ──────────────────────────────
function loadFromStorage(key, defaultValue) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : defaultValue
  } catch { return defaultValue }
}

function saveToStorage(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)) } catch (e) { console.warn('Storage error:', e) }
}

// ─── UTILITIES ────────────────────────────
export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('es-VE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function getWeekNumber() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  return Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7)
}
