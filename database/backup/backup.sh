#!/bin/bash

# MediReport Pro V3 - Local Backup Script
# Destinos: InForge (Remoto) -> PC Local (Este script)

# Configuración
DB_NAME="medireport_v3"
DB_USER="root"
DB_PASS="su_password_aqui" # Reemplazar con la contraseña real
BACKUP_DIR="/home/cservidores/Documentos/programacion/Sistema medico V2/MediReport_Pro_V3/database/backup/snapshots"
DATE=$(date +%Y-%m-%d_%H%M%S)
FILENAME="medireport_backup_$DATE.sql"

# Crear directorio si no existe
mkdir -p "$BACKUP_DIR"

echo "--- Iniciando Respaldo Diario: $DATE ---"

# Ejecutar mysqldump
# Nota: --single-transaction es mejor para InnoDB
if mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" --single-transaction --quick --lock-tables=false > "$BACKUP_DIR/$FILENAME"; then
    echo "[COMPLETO] Respaldo generado con éxito: $FILENAME"
    
    # Comprimir para ahorrar espacio
    gzip "$BACKUP_DIR/$FILENAME"
    echo "[GZIP] Archivo comprimido: $FILENAME.gz"
    
    # Limpieza: Mantener solo los últimos 30 días
    find "$BACKUP_DIR" -type f -mtime +30 -name "*.gz" -delete
    echo "[LIMPIEZA] Respaldos antiguos eliminados."
else
    echo "[ERROR] Falló el proceso de respaldo. Verifique credenciales y conexión MySQL."
    exit 1
fi

echo "--- Proceso Finalizado ---"
