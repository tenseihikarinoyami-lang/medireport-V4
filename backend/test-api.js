import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const API_URL = process.env.INSFORGE_API_URL || 'https://f8anua4h.us-east.insforge.app';
const API_KEY = process.env.INSFORGE_API_KEY;

console.log('Using API_URL:', API_URL);
console.log('API_KEY exists:', !!API_KEY);

const baseURL = `${API_URL.replace('/api/v1', '')}/api/database/records`;
console.log('Base URL:', baseURL);

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    },
    timeout: 10000
});

const defaultUsers = [
    { id: '1', name: 'Admin del Sistema', email: 'admin@marino.gob.ve', password: 'admin123', role: 'administrador', avatar: '🛡️', specialty: 'Administración', center: 'Alcaldía Santiago Mariño', asic: 'SAMAN DE GUERE', phone: '+58 412-1234567', cedula: 'V-12345678', isActive: true, createdAt: '2024-01-15T08:00:00' },
    { id: '2', name: 'Dra. María González', email: 'maria.gonzalez@hospital.com', password: 'coord123', role: 'coordinador', avatar: '👩‍⚕️', specialty: 'Medicina Interna', center: 'Hospital Central', asic: 'SAMAN DE GUERE', phone: '+58 414-7654321', cedula: 'V-87654321', isActive: true, createdAt: '2024-02-01T09:00:00' }
];

const runTest = async () => {
    try {
        console.log('Testing connection to /users...');
        const res = await api.get('/users');
        console.log('GET /users success:', res.data);

        console.log('Inserting a user...');
        const postRes = await api.post('/users', defaultUsers[0]);
        console.log('POST /users success:', postRes.data);
    } catch (err) {
        console.error('Test failed:', err.response?.data || err.message);
    }
};

runTest();
