import os
from pathlib import Path

# Rutas
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "best_model.keras"

# Configuración del modelo
SEQUENCE_LENGTH = 30  # Número de frames para detectar movimiento

# Clases (ajusta según tus datos)
CLASSES = ['ayuda', 'gracias', 'hola', 'no', 'por_favor', 'si']

# CORS
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",  # Vite
    "http://127.0.0.1:5173",
]