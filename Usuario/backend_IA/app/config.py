import os
from pathlib import Path
from typing import List

# ========== RUTAS ==========
# Directorio base del proyecto
BASE_DIR = Path(__file__).resolve().parent

# Directorio de modelos
MODELS_DIR = BASE_DIR / "models"

# Ruta del modelo principal
MODEL_PATH = MODELS_DIR / "sign_language_model.keras"

# Ruta del modelo alternativo (si existe)
BEST_MODEL_PATH = MODELS_DIR / "best_model.keras"

# ========== CONFIGURACIÓN DEL MODELO ==========
SEQUENCE_LENGTH = 30  # Número de frames para detectar movimiento

# Clases de señas (VERIFICA QUE ESTAS COINCIDAN CON TU MODELO)
CLASSES = ['ayuda', 'gracias', 'hola', 'no', 'por_favor', 'si']

# Umbral de confianza para predicciones
CONFIDENCE_THRESHOLD = 0.6

# ========== CONFIGURACIÓN DE CORS ==========
# Orígenes permitidos para desarrollo
ALLOWED_ORIGINS = [
    "http://localhost:3000",      # React
    "http://localhost:5173",      # Vite
    "http://127.0.0.1:5173",     # Vite alternativa
    "http://localhost:8000",      # FastAPI
    "http://127.0.0.1:8000",     # FastAPI alternativa
    "http://10.0.2.2:8000",      # Android Emulator
]

# ========== CONFIGURACIÓN DE SEGURIDAD ==========
MAX_FILE_SIZE_MB = 5  # Tamaño máximo de imagen (5MB)

# ========== CONFIGURACIÓN DE MEDIAPIPE ==========
MEDIAPIPE_CONFIG = {
    "min_detection_confidence": 0.5,
    "min_tracking_confidence": 0.5,
    "model_complexity": 1,
    "static_image_mode": False
}

# ========== CONFIGURACIÓN DEL DETECTOR ==========
DETECTOR_CONFIG = {
    "confidence_threshold": CONFIDENCE_THRESHOLD,
    "prediction_buffer_size": 5,
    "max_frames_without_hands": 15
}

# ========== VALIDACIONES ==========
def validate_config():
    """Validar configuración al inicio"""
    print("=" * 50)
    print("🔧 Validando configuración...")
    
    # Verificar que el modelo exista
    if not MODEL_PATH.exists():
        print(f"⚠️ ADVERTENCIA: No se encontró el modelo en:")
        print(f"   {MODEL_PATH}")
        
        # Verificar si existe el modelo alternativo
        if BEST_MODEL_PATH.exists():
            print(f"✅ Usando modelo alternativo: {BEST_MODEL_PATH.name}")
            return BEST_MODEL_PATH
        else:
            print(f"❌ ERROR: No hay modelos disponibles en {MODELS_DIR}")
            print(f"   Archivos encontrados: {list(MODELS_DIR.glob('*.keras'))}")
            return None
    else:
        print(f"✅ Modelo encontrado: {MODEL_PATH}")
        return MODEL_PATH

# Validar al importar
ACTUAL_MODEL_PATH = validate_config()

# Verificar clases
print(f"📊 Número de clases configuradas: {len(CLASSES)}")
print("=" * 50)