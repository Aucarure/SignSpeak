import os
from tensorflow import keras
import numpy as np

print("🔨 Creando modelo compatible con 258 features...")

# Verificar/crear carpeta models
os.makedirs('models', exist_ok=True)

# Crear modelo con 258 features (probablemente 2 manos + datos adicionales)
# Input: secuencia de 30 frames, cada frame con 258 features
model = keras.Sequential([
    keras.layers.Input(shape=(30, 258)),  # 258 features por frame
    keras.layers.LSTM(128, return_sequences=True, name='lstm_1'),
    keras.layers.Dropout(0.3, name='dropout_1'),
    keras.layers.LSTM(64, name='lstm_2'),
    keras.layers.Dropout(0.3, name='dropout_2'),
    keras.layers.Dense(64, activation='relu', name='dense_1'),
    keras.layers.Dropout(0.2, name='dropout_3'),
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
print(f"📊 Input shape: (batch_size, 30, 258)")
print(f"📊 Output shape: (batch_size, 6)")
print(f"\n🏷️  Clases soportadas:")
classes = ['ayuda', 'gracias', 'hola', 'no', 'por_favor', 'si']
for i, clase in enumerate(classes):
    print(f"   {i}: {clase}")

print("\n💡 Posible composición de 258 features:")
print("   - 2 manos × 21 puntos × 3 coords = 126")
print("   - + Pose (33 puntos × 4 coords) = 132")
print("   - Total: 258 features")

print("\n⚠️  IMPORTANTE: Este es un modelo sin entrenar.")
print("   Para producción, necesitas entrenarlo con tus datos reales.")
print("\n🚀 Reinicia el servidor: uvicorn app.main:app --reload --port 8000")