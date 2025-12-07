"""
Script para verificar versiones y compatibilidad
Ejecutar: python check_versions.py
"""

import sys
import platform

print("=" * 60)
print("🔍 DIAGNÓSTICO DE VERSIONES - SignSpeak")
print("=" * 60)

# Python
print(f"\n🐍 Python: {sys.version}")
print(f"   Versión: {platform.python_version()}")
print(f"   Arquitectura: {platform.architecture()[0]}")

# TensorFlow
try:
    import tensorflow as tf
    print(f"\n🧠 TensorFlow: {tf.__version__}")
    print(f"   Ubicación: {tf.__file__}")
except ImportError as e:
    print(f"\n❌ TensorFlow no instalado: {e}")

# Keras
try:
    import keras
    print(f"\n🔷 Keras: {keras.__version__}")
    print(f"   Ubicación: {keras.__file__}")
    
    # Verificar si es Keras 3.x (nuevo) o 2.x (legacy)
    keras_major = int(keras.__version__.split('.')[0])
    if keras_major >= 3:
        print(f"   ⚠️ ADVERTENCIA: Keras 3.x detectado")
        print(f"   Tu modelo fue entrenado con Keras 2.x")
        print(f"   Solución: Downgrade a Keras 2.15.0")
    else:
        print(f"   ✅ Keras 2.x (compatible)")
except ImportError as e:
    print(f"\n❌ Keras no instalado: {e}")

# NumPy
try:
    import numpy as np
    print(f"\n🔢 NumPy: {np.__version__}")
except ImportError as e:
    print(f"\n❌ NumPy no instalado: {e}")

# OpenCV
try:
    import cv2
    print(f"\n📷 OpenCV: {cv2.__version__}")
except ImportError as e:
    print(f"\n❌ OpenCV no instalado: {e}")

# MediaPipe
try:
    import mediapipe as mp
    print(f"\n🤚 MediaPipe: {mp.__version__}")
except ImportError as e:
    print(f"\n❌ MediaPipe no instalado: {e}")

# FastAPI
try:
    import fastapi
    print(f"\n🚀 FastAPI: {fastapi.__version__}")
except ImportError as e:
    print(f"\n❌ FastAPI no instalado: {e}")

# Verificar modelo
print("\n" + "=" * 60)
print("📦 VERIFICACIÓN DE MODELO")
print("=" * 60)

from pathlib import Path
model_path = Path("models/sign_language_model.keras")

if model_path.exists():
    size_mb = model_path.stat().st_size / (1024 * 1024)
    print(f"✅ Modelo encontrado: {model_path}")
    print(f"   Tamaño: {size_mb:.2f} MB")
else:
    print(f"❌ Modelo NO encontrado en: {model_path}")

# Recomendaciones
print("\n" + "=" * 60)
print("💡 RECOMENDACIONES")
print("=" * 60)

python_version = tuple(map(int, platform.python_version().split('.')))

if python_version >= (3, 12):
    print("\n⚠️ Python 3.12+ detectado")
    print("   Recomendación: Usar Python 3.10 o 3.11 para mejor compatibilidad")
elif python_version < (3, 8):
    print("\n⚠️ Python muy antiguo")
    print("   Recomendación: Actualizar a Python 3.10 o 3.11")
else:
    print("\n✅ Versión de Python compatible")

try:
    import keras
    keras_major = int(keras.__version__.split('.')[0])
    if keras_major >= 3:
        print("\n⚠️ PROBLEMA IDENTIFICADO: Keras 3.x")
        print("   Tu error es causado por incompatibilidad Keras 2.x -> 3.x")
        print("\n   SOLUCIÓN:")
        print("   1. pip uninstall keras tensorflow")
        print("   2. pip install tensorflow==2.15.0 keras==2.15.0")
except:
    pass

print("\n" + "=" * 60)
print("✅ Diagnóstico completado")
print("=" * 60)