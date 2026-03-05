import axios from 'axios';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de InsForge
const INSFORGE_API_URL = process.env.INSFORGE_API_URL || 'https://api.insforge.com/api/v1';
const PROJECT_ID = process.env.INSFORGE_PROJECT_ID;
const API_KEY = process.env.INSFORGE_API_KEY;

const BACKUP_DIR = path.join(__dirname, 'backups');

// Crear directorio de respaldos si no existe
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const log = (msg) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${msg}`);
};

/**
 * Función principal para respaldar datos desde InsForge
 */
const performBackup = async () => {
    log('Iniciando respaldo local desde InsForge...');

    if (!PROJECT_ID || !API_KEY) {
        log('ALERTA: Faltan credenciales de InsForge (PROJECT_ID o API_KEY) en el archivo .env. Abortando respaldo.');
        return;
    }

    const dateStr = new Date().toISOString().slice(0, 10);
    const dailyDir = path.join(BACKUP_DIR, dateStr);

    if (!fs.existsSync(dailyDir)) {
        fs.mkdirSync(dailyDir, { recursive: true });
    }

    // Colecciones o tablas que queremos respaldar localmente
    const collections = ['users', 'reports', 'jornadas', 'alerts'];
    let successCount = 0;

    for (const collection of collections) {
        try {
            // Ajustar esta URL según la estructura exacta de los endpoints de lectura en InsForge
            const url = `${INSFORGE_API_URL}/projects/${PROJECT_ID}/data/${collection}`;

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Accept': 'application/json'
                },
                timeout: 10000 // 10 segundos timeout
            });

            const data = response.data;
            const filePath = path.join(dailyDir, `${collection}.json`);

            // Guardar de forma elegante (indentación 2 espacios)
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

            // Intentar contar registros asumiendo que data es un array o { documents: [...] }
            const count = Array.isArray(data) ? data.length : (data.documents ? data.documents.length : '?');
            log(`Respaldo exitoso: ${collection}.json (${count} registros guardados)`);
            successCount++;
        } catch (error) {
            log(`Error al respaldar ${collection}: ${error.message}`);
            if (error.response) {
                log(`Detalles del servidor: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            }
        }
    }

    log(`Respaldo finalizado. Colecciones descargadas: ${successCount}/${collections.length}`);
};

// Iniciar cron o ejecución manual
const args = process.argv.slice(2);
if (args.includes('force')) {
    log('Ejecución manual solicitada.');
    performBackup().then(() => process.exit(0));
} else {
    log('======================================================');
    log('  MediReport Pro V4 - Motor de Respaldo Local Activo  ');
    log('======================================================');
    log('Sincronizando diariamente con InsForge a las 23:55 PM.');

    // Expresión Cron: Minuto 55, Hora 23, todos los días
    cron.schedule('55 23 * * *', () => {
        performBackup();
    });
}
