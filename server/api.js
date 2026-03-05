/**
 * MediReport Pro V3 - Sync & API Server
 * Backend para comunicación con MySQL (InForge) y gestión de sincronización local.
 */
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de Base de Datos (InForge MySQL)
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'medireport_v3'
};

// Conexión pool
const pool = mysql.createPool(dbConfig);

// --- API Endpoints ---

// Obtener todos los reportes
app.get('/api/reports', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM reports ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear nuevo reporte
app.post('/api/reports', async (req, res) => {
    const { id, type, title, data, created_by_user_id, created_by_name, center } = req.body;
    try {
        await pool.query(
            'INSERT INTO reports (id, type, title, data, created_by_user_id, created_by_name, center) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, type, title, JSON.stringify(data), created_by_user_id, created_by_name, center]
        );
        res.status(201).json({ message: 'Reporte guardado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Trigger Manual de Respaldo Local
app.post('/api/backup/local', (req, res) => {
    const scriptPath = path.join(process.cwd(), 'database', 'backup', 'backup.sh');
    exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: 'Error ejecutando respaldo local' });
        }
        res.json({ message: 'Respaldo local iniciado', output: stdout });
    });
});

// Sincronización continua de datos (Mock de Webhook de InForge)
app.post('/api/sync', async (req, res) => {
    // Aquí se recibirían los cambios desde InForge para replicar localmente
    // O se enviaría lo local a InForge.
    res.json({ status: 'Synchronization active' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 MediReport V3 Sync Server running on port ${PORT}`);
    console.log(`🔗 Conectado a MySQL: ${dbConfig.host}:${dbConfig.database}`);
});

// Cron-like task for automatic daily backup (simplified)
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 23 && now.getMinutes() === 50) { // 11:50 PM
        console.log('[CRON] Ejecutando respaldo automático diario...');
        const scriptPath = path.join(process.cwd(), 'database', 'backup', 'backup.sh');
        exec(`bash ${scriptPath}`);
    }
}, 60000);
