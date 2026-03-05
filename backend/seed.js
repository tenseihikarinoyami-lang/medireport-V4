import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const API_URL = process.env.INSFORGE_API_URL || 'https://f8anua4h.us-east.insforge.app';
const API_KEY = process.env.INSFORGE_API_KEY;

const api = axios.create({
    baseURL: `${API_URL.replace('/api/v1', '')}/api/database/records`,
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }
});

const userIdAdmin = 'd41c9ba8-4c31-4822-8b43-9829f0ce2201';
const userIdCoord = 'd41c9ba8-4c31-4822-8b43-9829f0ce2202';
const userIdDr = 'd41c9ba8-4c31-4822-8b43-9829f0ce2203';
const userIdEnf = 'd41c9ba8-4c31-4822-8b43-9829f0ce2204';

const defaultUsers = [
    { id: userIdAdmin, name: 'Admin del Sistema', email: 'admin', password: 'admin123', role: 'administrador', avatar: '🛡️', specialty: 'Administración', center: 'Alcaldía Santiago Mariño', asic: 'SAMAN DE GUERE', phone: '+58 412-1234567', cedula: 'V-12345678', isActive: true, createdAt: '2024-01-15T08:00:00' },
    { id: userIdCoord, name: 'Dra. María González', email: 'maria.gonzalez@hospital.com', password: 'coord123', role: 'coordinador', avatar: '👩‍⚕️', specialty: 'Medicina Interna', center: 'Hospital Central', asic: 'SAMAN DE GUERE', phone: '+58 414-7654321', cedula: 'V-87654321', isActive: true, createdAt: '2024-02-01T09:00:00' },
    { id: userIdDr, name: 'Dr. Carlos Rodríguez', email: 'carlos.rodriguez@cdi.com', password: 'doctor123', role: 'doctor', avatar: '👨‍⚕️', specialty: 'Medicina General', center: 'CDI Los Robles', asic: 'LOS COCOS', phone: '+58 416-9876543', cedula: 'V-11223344', isActive: true, createdAt: '2024-02-15T10:00:00' },
    { id: userIdEnf, name: 'Enf. Ana Martínez', email: 'ana.martinez@cdi.com', password: 'doctor123', role: 'enfermero', avatar: '💉', specialty: 'Enfermería General', center: 'CDI Los Robles', asic: 'LOS COCOS', phone: '+58 424-1122334', cedula: 'V-33445566', isActive: true, createdAt: '2024-03-01T08:30:00' }
];

const reportId1 = 'd41c9ba8-4c31-4822-8b43-9829f0ce2211';
const reportId2 = 'd41c9ba8-4c31-4822-8b43-9829f0ce2212';

const defaultReports = [
    { id: reportId1, tipo: 'morbilidad', semana: 9, fecha: new Date().toISOString().slice(0, 10), centroSalud: 'CDI Los Robles', asic: 'LOS COCOS', estado: 'completado', createdByUserId: userIdDr, createdByName: 'Dr. Carlos Rodríguez', datos: { emergencias: 45, consultas: 120, vidasSalvadas: 2, hospitalizaciones: 8 }, createdAt: new Date().toISOString() },
    { id: reportId2, tipo: 'morbilidad', semana: 9, fecha: new Date().toISOString().slice(0, 10), centroSalud: 'Hospital Central', asic: 'SAMAN DE GUERE', estado: 'borrador', createdByUserId: userIdCoord, createdByName: 'Dra. María González', datos: { emergencias: 30, consultas: 95, vidasSalvadas: 1, hospitalizaciones: 5 }, createdAt: new Date().toISOString() }
];

const jornadaId1 = 'd41c9ba8-4c31-4822-8b43-9829f0ce2221';

const defaultJornadas = [
    { id: jornadaId1, nombre: 'Jornada de Despistaje de Cáncer', tipo: 'despistaje', fecha: new Date().toISOString().slice(0, 10), ubicacion: 'Plaza Bolívar', comunidad: 'Saman de Guere', asic: 'SAMAN DE GUERE', responsableId: userIdCoord, responsableNombre: 'Dra. María González', participantes: ['Enf. Ana Martínez'], indicadores: { despistajecaMama: 15, positivos: 2 }, observaciones: 'Buena asistencia', estado: 'finalizada', createdAt: new Date().toISOString() }
];

const seedCollection = async (collectionName, dataArray) => {
    console.log(`\nSeeding ${collectionName}...`);
    for (const item of dataArray) {
        try {
            // Strip fields that don't exist in the current schema to avoid errors
            const { _id, createdAt, auditLog, audit_log, leidaPor, isActive, indicadores, ...validPayload } = item;

            const { data, error } = await api.post(`/${collectionName}`, validPayload);
            console.log(` + Inserted ${validPayload.id} into ${collectionName}`);
        } catch (err) {
            console.error(` - Error inserting into ${collectionName}:`, err.response?.data || err.message);
        }
    }
};

const runSeed = async () => {
    console.log('Connecting to InsForge to seed initial data...');
    if (!API_KEY) {
        console.error("Missing API Key!");
        return;
    }
    await seedCollection('users', defaultUsers);
    await seedCollection('reports', defaultReports);
    await seedCollection('jornadas', defaultJornadas);
    await seedCollection('alerts', [
        { id: 'd41c9ba8-4c31-4822-8b43-9829f0ce2231', titulo: 'Alerta Epidemiológica - Dengue', mensaje: 'Se reporta aumento de casos de dengue en el municipio.', tipo: 'urgent', prioridad: 'alta', emitidaPor: 'Admin del Sistema', emitidaPorId: userIdAdmin, fecha: new Date().toISOString(), leida: false }
    ]);
    console.log('\nSeed process complete!');
};

runSeed();
