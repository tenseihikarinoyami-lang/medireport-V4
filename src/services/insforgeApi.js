import { createClient } from '@insforge/sdk'

// =====================================================
// INSFORGE SDK — CLIENTE OFICIAL
// =====================================================
// Estas variables deben estar en el archivo .env del proyecto:
//   VITE_INSFORGE_URL
//   VITE_INSFORGE_ANON_KEY
// =====================================================
const INSFORGE_URL = import.meta.env.VITE_INSFORGE_URL || 'https://f8anua4h.us-east.insforge.app'
const INSFORGE_ANON = import.meta.env.VITE_INSFORGE_ANON_KEY || ''

export const insforge = createClient({
    baseUrl: INSFORGE_URL,
    anonKey: INSFORGE_ANON
})

const db = insforge.database

// =====================================================
// INSFORGE SERVICE — CRUD helpers
// =====================================================
export const InsForgeService = {

    // ─── REPORTS ─────────────────────────────────────
    getReports: async () => {
        const { data, error } = await db.from('reports').select()
        if (error) { console.error('InsForge getReports:', error); return [] }
        return data || []
    },
    createReport: async (reportData) => {
        // Strip non-serializable fields for cloud storage
        const payload = {
            id: reportData.id,
            tipo: reportData.tipo,
            fecha: reportData.fecha,
            asic: reportData.asic,
            centroSalud: reportData.centroSalud,
            estado: reportData.estado,
            createdByUserId: reportData.createdByUserId,
            createdByName: reportData.createdByName,
            datos: JSON.stringify(reportData.datos || {}),
            createdAt: reportData.createdAt || new Date().toISOString()
        }
        const { data, error } = await db.from('reports').insert(payload).select()
        if (error) console.error('InsForge createReport:', error)
        return data
    },
    updateReport: async (id, reportData) => {
        const { data, error } = await db.from('reports')
            .update({ estado: reportData.estado, datos: JSON.stringify(reportData.datos || {}) })
            .eq('id', id).select()
        if (error) console.error('InsForge updateReport:', error)
        return data
    },
    deleteReport: async (id) => {
        const { error } = await db.from('reports').delete().eq('id', id)
        if (error) console.error('InsForge deleteReport:', error)
    },

    // ─── JORNADAS ────────────────────────────────────
    getJornadas: async () => {
        const { data, error } = await db.from('jornadas').select()
        if (error) { console.error('InsForge getJornadas:', error); return [] }
        return data || []
    },
    createJornada: async (jornadaData) => {
        const payload = {
            id: jornadaData.id,
            nombre: jornadaData.nombre,
            tipo: jornadaData.tipo,
            fecha: jornadaData.fecha,
            ubicacion: jornadaData.ubicacion,
            comunidad: jornadaData.comunidad || '',
            asic: jornadaData.asic,
            responsableId: jornadaData.responsableId,
            responsableNombre: jornadaData.responsableNombre,
            estado: jornadaData.estado,
            createdAt: jornadaData.createdAt || new Date().toISOString()
        }
        const { data, error } = await db.from('jornadas').insert(payload).select()
        if (error) console.error('InsForge createJornada:', error)
        return data
    },
    updateJornada: async (id, jornadaData) => {
        const { data, error } = await db.from('jornadas')
            .update({ estado: jornadaData.estado })
            .eq('id', id).select()
        if (error) console.error('InsForge updateJornada:', error)
        return data
    },
    deleteJornada: async (id) => {
        const { error } = await db.from('jornadas').delete().eq('id', id)
        if (error) console.error('InsForge deleteJornada:', error)
    },

    // ─── ALERTS ──────────────────────────────────────
    getAlerts: async () => {
        const { data, error } = await db.from('alerts').select()
        if (error) { console.error('InsForge getAlerts:', error); return [] }
        return data || []
    },
    createAlert: async (alertData) => {
        const payload = {
            id: alertData.id,
            titulo: alertData.titulo,
            mensaje: alertData.mensaje,
            tipo: alertData.tipo,
            prioridad: alertData.prioridad,
            emitidaPor: alertData.emitidaPor,
            emitidaPorId: alertData.emitidaPorId,
            fecha: alertData.fecha || new Date().toISOString(),
            leida: alertData.leida ? 'true' : 'false'
        }
        const { data, error } = await db.from('alerts').insert(payload).select()
        if (error) console.error('InsForge createAlert:', error)
        return data
    },
    updateAlert: async (id, alertData) => {
        const { data, error } = await db.from('alerts')
            .update({ leida: alertData.leida ? 'true' : 'false' })
            .eq('id', id).select()
        if (error) console.error('InsForge updateAlert:', error)
        return data
    },

    // ─── USERS ───────────────────────────────────────
    getUsers: async () => {
        const { data, error } = await db.from('users').select()
        if (error) { console.error('InsForge getUsers:', error); return [] }
        return data || []
    },
    createUser: async (userData) => {
        const payload = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            specialty: userData.specialty || '',
            center: userData.center || '',
            asic: userData.asic || '',
            cedula: userData.cedula || '',
            phone: userData.phone || '',
            isActive: userData.isActive ? 'true' : 'false',
            createdAt: userData.createdAt || new Date().toISOString()
        }
        const { data, error } = await db.from('users').insert(payload).select()
        if (error) console.error('InsForge createUser:', error)
        return data
    },
    updateUser: async (id, userData) => {
        const { data, error } = await db.from('users')
            .update({ name: userData.name, role: userData.role, isActive: userData.isActive ? 'true' : 'false' })
            .eq('id', id).select()
        if (error) console.error('InsForge updateUser:', error)
        return data
    },
    deleteUser: async (id) => {
        const { error } = await db.from('users').delete().eq('id', id)
        if (error) console.error('InsForge deleteUser:', error)
    }
}

export default insforge
