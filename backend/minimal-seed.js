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

const runMinimalSeed = async () => {
    try {
        console.log('Inserting minimal user...');
        const res = await api.post('/users', { id: 'admin_test', name: 'Admin Test' });
        console.log('Success:', res.data);
    } catch (err) {
        console.error('Failed:', err.response?.data || err.message);
    }
};

runMinimalSeed();
