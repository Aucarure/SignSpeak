import os
from tensorflow import keras
import numpy as np

print("🔨 Creando modelo compatible con TensorFlow 2.15...")

# Verificar/crear carpeta models
os.makedirs('models', exist_ok=True)

# Crear modelo con arquitectura compatible
# Input: secuencia de 30 frames, cada frame con 63 keypoints (21 puntos x 3 coordenadas)
model = keras.Sequential([
    keras.layers.Input(shape=(30, 63)),  # Usar Input() en vez de batch_shape
    keras.layers.LSTM(64, return_sequences=True, name='lstm_1'),
    keras.layers.Dropout(0.2, name='dropout_1'),
    keras.layers.LSTM(32, name='lstm_2'),
    keras.layers.Dropout(0.2, name='dropout_2'),
    keras.layers.Dense(32, activation='relu', name='dense_1'),
    keras.layers.Dense(6, activation='softmax', name='output')  # 6 clases
])

# Compilar modelo
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Mostrar resumen
print("\n📊 Arquitectura del modelo:")
model.summary()

# Guardar modelo
model_path = 'models/sign_language_model.keras'
model.save(model_path)

print(f"\n✅ Modelo compatible creado exitosamente!")
print(f"📁 Ubicación: {os.path.abspath(model_path)}")
print(f"📊 Input shape: (batch_size, 30, 63)")
print(f"📊 Output shape: (batch_size, 6)")
print(f"\n🏷️  Clases soportadas:")
classes = ['ayuda', 'gracias', 'hola', 'no', 'por_favor', 'si']
for i, clase in enumerate(classes):
    print(f"   {i}: {clase}")

print("\n⚠️  IMPORTANTE: Este es un modelo sin entrenar.")
print("   Para producción, necesitas entrenarlo con tus datos reales.")
print("\n🚀 Ahora puedes ejecutar: uvicorn app.main:app --reload --port 8000")