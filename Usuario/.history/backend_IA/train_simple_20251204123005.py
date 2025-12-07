import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import cv2
import os
from pathlib import Path
import json

class SignLanguageTrainer:
    def __init__(self):
        self.model = None
        self.class_names = ['hola', 'gracias']
        self.img_size = (224, 224)
        self.data_dir = Path('training_data')
        
    def create_dataset_structure(self):
        """Crea la estructura de carpetas para los datos"""
        print("📁 Creando estructura de carpetas...")
        
        for class_name in self.class_names:
            class_path = self.data_dir / class_name
            class_path.mkdir(parents=True, exist_ok=True)
        
        print(f"✅ Carpetas creadas en: {self.data_dir}")
        print("\n📸 Ahora coloca tus imágenes en:")
        print(f"   - {self.data_dir / 'hola'}/  -> Imágenes de la seña 'hola'")
        print(f"   - {self.data_dir / 'gracias'}/  -> Imágenes de la seña 'gracias'")
        print("\n💡 Tip: Necesitas al menos 100 imágenes por seña para buenos resultados")
        
    def capture_images(self, class_name, num_images=150):
        """Captura imágenes desde la webcam para una clase específica"""
        print(f"\n📷 Capturando {num_images} imágenes para '{class_name}'")
        print("Presiona ESPACIO para capturar, ESC para salir")
        
        cap = cv2.VideoCapture(0)
        count = 0
        save_path = self.data_dir / class_name
        
        while count < num_images:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Mostrar contador
            cv2.putText(frame, f"{class_name}: {count}/{num_images}", 
                       (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.putText(frame, "ESPACIO: capturar | ESC: salir", 
                       (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            
            cv2.imshow('Captura de Señas', frame)
            
            key = cv2.waitKey(1)
            if key == 27:  # ESC
                break
            elif key == 32:  # ESPACIO
                img_path = save_path / f"{class_name}_{count:04d}.jpg"
                cv2.imwrite(str(img_path), frame)
                count += 1
                print(f"✅ Capturada: {count}/{num_images}")
        
        cap.release()
        cv2.destroyAllWindows()
        print(f"✅ Captura completada: {count} imágenes guardadas")
        
    def load_and_preprocess_data(self):
        """Carga y preprocesa las imágenes"""
        print("\n📊 Cargando datos...")
        
        # Data augmentation para mejorar el entrenamiento
        train_datagen = tf.keras.preprocessing.image.ImageDataGenerator(
            rescale=1./255,
            validation_split=0.2,
            rotation_range=15,
            width_shift_range=0.1,
            height_shift_range=0.1,
            zoom_range=0.1,
            horizontal_flip=True,
            brightness_range=[0.8, 1.2]
        )
        
        train_generator = train_datagen.flow_from_directory(
            self.data_dir,
            target_size=self.img_size,
            batch_size=32,
            class_mode='categorical',
            subset='training',
            shuffle=True
        )
        
        val_generator = train_datagen.flow_from_directory(
            self.data_dir,
            target_size=self.img_size,
            batch_size=32,
            class_mode='categorical',
            subset='validation',
            shuffle=False
        )
        
        print(f"✅ Datos cargados:")
        print(f"   - Entrenamiento: {train_generator.samples} imágenes")
        print(f"   - Validación: {val_generator.samples} imágenes")
        print(f"   - Clases: {train_generator.class_indices}")
        
        return train_generator, val_generator
    
    def create_model(self):
        """Crea un modelo CNN simple pero efectivo"""
        print("\n🧠 Creando modelo de red neuronal...")
        
        model = keras.Sequential([
            # Capa de entrada
            layers.Input(shape=(*self.img_size, 3)),
            
            # Bloque convolucional 1
            layers.Conv2D(32, (3, 3), activation='relu'),
            layers.MaxPooling2D((2, 2)),
            layers.BatchNormalization(),
            
            # Bloque convolucional 2
            layers.Conv2D(64, (3, 3), activation='relu'),
            layers.MaxPooling2D((2, 2)),
            layers.BatchNormalization(),
            
            # Bloque convolucional 3
            layers.Conv2D(128, (3, 3), activation='relu'),
            layers.MaxPooling2D((2, 2)),
            layers.BatchNormalization(),
            
            # Bloque convolucional 4
            layers.Conv2D(256, (3, 3), activation='relu'),
            layers.MaxPooling2D((2, 2)),
            layers.BatchNormalization(),
            
            # Capas densas
            layers.Flatten(),
            layers.Dropout(0.5),
            layers.Dense(512, activation='relu'),
            layers.Dropout(0.3),
            layers.Dense(len(self.class_names), activation='softmax')
        ])
        
        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        print("✅ Modelo creado")
        model.summary()
        
        self.model = model
        return model
    
    def train(self, train_data, val_data, epochs=30):
        """Entrena el modelo"""
        print(f"\n🚀 Iniciando entrenamiento por {epochs} épocas...")
        
        callbacks = [
            keras.callbacks.ModelCheckpoint(
                'models/sign_language_model.keras',
                save_best_only=True,
                monitor='val_accuracy',
                verbose=1
            ),
            keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=7,
                restore_best_weights=True,
                verbose=1
            ),
            keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=3,
                min_lr=0.00001,
                verbose=1
            )
        ]
        
        history = self.model.fit(
            train_data,
            validation_data=val_data,
            epochs=epochs,
            callbacks=callbacks,
            verbose=1
        )
        
        return history
    
    def save_training_info(self, history):
        """Guarda información del entrenamiento"""
        print("\n💾 Guardando información del entrenamiento...")
        
        # Guardar historial
        np.save('models/training_history.npy', history.history)
        
        # Guardar configuración
        config = {
            'class_names': self.class_names,
            'img_size': self.img_size,
            'final_accuracy': float(history.history['accuracy'][-1]),
            'final_val_accuracy': float(history.history['val_accuracy'][-1])
        }
        
        with open('models/model_config.json', 'w') as f:
            json.dump(config, f, indent=4)
        
        print("✅ Información guardada")
        print(f"📈 Precisión final: {config['final_accuracy']:.2%}")
        print(f"📈 Precisión validación: {config['final_val_accuracy']:.2%}")
    
    def test_model(self):
        """Prueba el modelo con la webcam"""
        print("\n🎥 Probando modelo en tiempo real...")
        print("Presiona 'q' para salir")
        
        model = keras.models.load_model('models/sign_language_model.keras')
        cap = cv2.VideoCapture(0)
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Preprocesar frame
            img = cv2.resize(frame, self.img_size)
            img_array = np.expand_dims(img, 0) / 255.0
            
            # Predicción
            predictions = model.predict(img_array, verbose=0)
            class_idx = np.argmax(predictions[0])
            confidence = predictions[0][class_idx]
            
            # Mostrar resultado
            label = self.class_names[class_idx]
            color = (0, 255, 0) if confidence > 0.7 else (0, 165, 255)
            
            cv2.putText(frame, f"{label}: {confidence:.2%}", 
                       (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)
            cv2.putText(frame, "Presiona 'q' para salir", 
                       (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            
            cv2.imshow('Prueba de Modelo', frame)
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        
        cap.release()
        cv2.destroyAllWindows()

# ============================================
# FUNCIÓN PRINCIPAL
# ============================================

def main():
    print("=" * 60)
    print("🤟 ENTRENADOR DE LENGUAJE DE SEÑAS: HOLA Y GRACIAS")
    print("=" * 60)
    
    trainer = SignLanguageTrainer()
    
    # Menú interactivo
    while True:
        print("\n📋 MENÚ:")
        print("1. Crear estructura de carpetas")
        print("2. Capturar imágenes desde webcam")
        print("3. Entrenar modelo")
        print("4. Probar modelo")
        print("5. Salir")
        
        choice = input("\nSelecciona una opción (1-5): ").strip()
        
        if choice == '1':
            trainer.create_dataset_structure()
            
        elif choice == '2':
            print("\n📸 CAPTURA DE IMÁGENES")
            print("¿Qué seña quieres capturar?")
            print("1. Hola")
            print("2. Gracias")
            seña = input("Selecciona (1-2): ").strip()
            
            class_name = 'hola' if seña == '1' else 'gracias'
            num_imgs = input("¿Cuántas imágenes? (recomendado: 150): ").strip()
            num_imgs = int(num_imgs) if num_imgs.isdigit() else 150
            
            trainer.capture_images(class_name, num_imgs)
            
        elif choice == '3':
            print("\n🎓 ENTRENAMIENTO")
            
            # Verificar que existen datos
            if not trainer.data_dir.exists():
                print("❌ No se encontraron datos. Primero captura imágenes.")
                continue
            
            # Cargar datos
            train_gen, val_gen = trainer.load_and_preprocess_data()
            
            # Crear y entrenar modelo
            trainer.create_model()
            
            epochs = input("¿Cuántas épocas? (recomendado: 30): ").strip()
            epochs = int(epochs) if epochs.isdigit() else 30
            
            history = trainer.train(train_gen, val_gen, epochs)
            trainer.save_training_info(history)
            
            print("\n🎉 ¡Entrenamiento completado!")
            
        elif choice == '4':
            if not Path('models/sign_language_model.keras').exists():
                print("❌ No se encontró el modelo. Primero entrena el modelo.")
                continue
            
            trainer.test_model()
            
        elif choice == '5':
            print("\n👋 ¡Hasta luego!")
            break
            
        else:
            print("❌ Opción no válida")

if __name__ == "__main__":
    main()