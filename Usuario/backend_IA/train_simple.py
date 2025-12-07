import cv2
import mediapipe as mp
import numpy as np
import json
import os
from pathlib import Path
from datetime import datetime
import tensorflow as tf
from tensorflow import keras
from sklearn.model_selection import train_test_split

class HandSignTrainer:
    def __init__(self):
        # MediaPipe setup
        self.mp_hands = mp.solutions.hands
        self.mp_drawing = mp.solutions.drawing_utils
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=1,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5
        )
        
        # 🔴 CAMBIADO: 4 clases en total
        self.class_names = ['hola', 'gracias', 'adios', 'mucho_gusto']
        self.data_dir = Path('hand_landmarks_data')
        self.data_dir.mkdir(exist_ok=True)
        
        # Almacenamiento temporal de frames
        self.current_frames = []
        self.frames_per_sample = 30  # Frames por muestra
        
    def extract_landmarks(self, hand_landmarks):
        """Extrae las coordenadas de los 21 puntos de la mano"""
        landmarks = []
        for landmark in hand_landmarks.landmark:
            landmarks.extend([landmark.x, landmark.y, landmark.z])
        return np.array(landmarks)
    
    def normalize_landmarks(self, landmarks):
        """Normaliza los landmarks relativos a la muñeca"""
        landmarks = landmarks.reshape(-1, 3)
        wrist = landmarks[0]
        normalized = landmarks - wrist
        return normalized.flatten()
    
    def capture_training_data(self, class_name, num_samples=50):
        """Captura datos de entrenamiento para una clase"""
        print(f"\n📹 CAPTURANDO DATOS PARA: {class_name.upper()}")
        print(f"🎯 Objetivo: {num_samples} muestras de {self.frames_per_sample} frames cada una")
        print("\n📋 INSTRUCCIONES:")
        print("  - Mantén la seña estable")
        print("  - Presiona ESPACIO para capturar una muestra")
        print("  - Presiona 'r' para resetear la muestra actual")
        print("  - Presiona ESC para terminar")
        print("\n¡Comenzando en 3 segundos!")
        
        import time
        time.sleep(3)
        
        cap = cv2.VideoCapture(0)
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
        
        samples_collected = []
        current_sample_frames = []
        recording = False
        sample_count = 0
        
        while sample_count < num_samples:
            ret, frame = cap.read()
            if not ret:
                break
            
            frame = cv2.flip(frame, 1)
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.hands.process(frame_rgb)
            
            # Dibujar landmarks si se detectan
            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    self.mp_drawing.draw_landmarks(
                        frame, 
                        hand_landmarks, 
                        self.mp_hands.HAND_CONNECTIONS,
                        self.mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                        self.mp_drawing.DrawingSpec(color=(255, 0, 0), thickness=2)
                    )
                    
                    # Si está grabando, guardar landmarks
                    if recording:
                        landmarks = self.extract_landmarks(hand_landmarks)
                        landmarks = self.normalize_landmarks(landmarks)
                        current_sample_frames.append(landmarks)
            
            # Interfaz
            status_color = (0, 255, 0) if results.multi_hand_landmarks else (0, 0, 255)
            hand_status = "✓ Mano detectada" if results.multi_hand_landmarks else "✗ Sin mano"
            
            # Info panel
            cv2.rectangle(frame, (10, 10), (600, 180), (0, 0, 0), -1)
            cv2.rectangle(frame, (10, 10), (600, 180), status_color, 2)
            
            cv2.putText(frame, f"Clase: {class_name.upper()}", 
                       (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
            cv2.putText(frame, hand_status, 
                       (20, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.7, status_color, 2)
            cv2.putText(frame, f"Muestras: {sample_count}/{num_samples}", 
                       (20, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            
            if recording:
                progress = len(current_sample_frames) / self.frames_per_sample
                cv2.putText(frame, f"GRABANDO: {len(current_sample_frames)}/{self.frames_per_sample}", 
                           (20, 130), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
                cv2.rectangle(frame, (20, 145), (20 + int(560 * progress), 165), (0, 255, 255), -1)
            else:
                cv2.putText(frame, "ESPACIO: Capturar | R: Reset | ESC: Salir", 
                           (20, 130), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 2)
            
            cv2.imshow('Captura de Señas - Landmarks', frame)
            
            # Controles
            key = cv2.waitKey(1) & 0xFF
            
            if key == 27:  # ESC
                break
            elif key == ord(' ') and not recording and results.multi_hand_landmarks:  # ESPACIO
                recording = True
                current_sample_frames = []
                print(f"🔴 Grabando muestra {sample_count + 1}...")
            elif key == ord('r'):  # R - Reset
                recording = False
                current_sample_frames = []
                print("🔄 Muestra reseteada")
            
            # Autocompletar muestra cuando alcanza los frames requeridos
            if recording and len(current_sample_frames) >= self.frames_per_sample:
                samples_collected.append(current_sample_frames.copy())
                sample_count += 1
                recording = False
                current_sample_frames = []
                print(f"✅ Muestra {sample_count} guardada! ({sample_count}/{num_samples})")
        
        cap.release()
        cv2.destroyAllWindows()
        
        # Guardar datos
        if samples_collected:
            self.save_samples(class_name, samples_collected)
            print(f"\n✅ {len(samples_collected)} muestras guardadas para '{class_name}'")
        
        return len(samples_collected)
    
    def save_samples(self, class_name, samples):
        """Guarda las muestras en disco"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = self.data_dir / f"{class_name}_{timestamp}.npy"
        
        # Convertir a array numpy
        samples_array = np.array(samples)  # Shape: (num_samples, frames_per_sample, 63)
        np.save(filename, samples_array)
        
        print(f"💾 Guardado en: {filename}")
        print(f"📊 Shape: {samples_array.shape}")
    
    def load_all_data(self):
        """Carga todos los datos guardados"""
        print("\n📂 Cargando datos...")
        
        X = []
        y = []
        
        for class_idx, class_name in enumerate(self.class_names):
            files = list(self.data_dir.glob(f"{class_name}_*.npy"))
            
            if not files:
                print(f"⚠️  No se encontraron datos para '{class_name}'")
                continue
            
            for file in files:
                data = np.load(file)
                X.extend(data)
                y.extend([class_idx] * len(data))
            
            print(f"✅ {class_name}: {len([f for f in files])} archivos, {sum([len(np.load(f)) for f in files])} muestras")
        
        if not X:
            print("❌ No se encontraron datos para entrenar")
            return None, None
        
        X = np.array(X)
        y = np.array(y)
        
        print(f"\n📊 Dataset completo:")
        print(f"   - X shape: {X.shape}")  # (total_samples, frames, 63)
        print(f"   - y shape: {y.shape}")
        print(f"   - Total muestras: {len(X)}")
        print(f"   - Clases: {self.class_names}")
        
        return X, y
    
    def create_model(self, input_shape):
        """Crea un modelo LSTM para secuencias temporales"""
        print("\n🧠 Creando modelo LSTM...")
        
        model = keras.Sequential([
            keras.layers.Input(shape=input_shape),
            
            # Capas LSTM para procesar secuencias
            keras.layers.LSTM(128, return_sequences=True),
            keras.layers.Dropout(0.3),
            keras.layers.LSTM(64, return_sequences=True),
            keras.layers.Dropout(0.3),
            keras.layers.LSTM(32),
            keras.layers.Dropout(0.3),
            
            # Capas densas
            keras.layers.Dense(64, activation='relu'),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(len(self.class_names), activation='softmax')
        ])
        
        model.compile(
            optimizer='adam',
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        
        print("✅ Modelo creado")
        print(f"📊 Clases de salida: {len(self.class_names)}")
        model.summary()
        
        return model
    
    def train_model(self, epochs=50):
        """Entrena el modelo con los datos capturados"""
        print("\n🎓 INICIANDO ENTRENAMIENTO")
        
        # Cargar datos
        X, y = self.load_all_data()
        if X is None:
            return
        
        # Verificar que tenemos datos para todas las clases
        unique_classes = np.unique(y)
        print(f"\n🔍 Verificación de clases:")
        for class_idx in range(len(self.class_names)):
            count = np.sum(y == class_idx)
            print(f"   - {self.class_names[class_idx]}: {count} muestras")
        
        if len(unique_classes) < len(self.class_names):
            print(f"\n⚠️  ADVERTENCIA: Faltan datos para algunas clases!")
            print(f"   Se esperaban {len(self.class_names)} clases, pero solo hay {len(unique_classes)}")
            print(f"   Captura datos para todas las clases antes de entrenar.")
            return
        
        # Split train/test
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        print(f"\n📊 División de datos:")
        print(f"   - Entrenamiento: {len(X_train)} muestras")
        print(f"   - Prueba: {len(X_test)} muestras")
        
        # Crear modelo
        input_shape = (X.shape[1], X.shape[2])  # (frames, landmarks)
        model = self.create_model(input_shape)
        
        # Callbacks
        callbacks = [
            keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=15,
                restore_best_weights=True,
                verbose=1
            ),
            keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=7,
                min_lr=0.00001,
                verbose=1
            ),
            keras.callbacks.ModelCheckpoint(
                'models/sign_language_model.keras',
                save_best_only=True,
                monitor='val_accuracy',
                verbose=1
            )
        ]
        
        # Entrenar
        print(f"\n🚀 Entrenando por {epochs} épocas...")
        history = model.fit(
            X_train, y_train,
            validation_data=(X_test, y_test),
            epochs=epochs,
            batch_size=32,
            callbacks=callbacks,
            verbose=1
        )
        
        # Evaluar
        print("\n📈 Evaluando modelo...")
        test_loss, test_acc = model.evaluate(X_test, y_test, verbose=0)
        print(f"✅ Precisión en prueba: {test_acc:.2%}")
        
        # Mostrar matriz de confusión
        print("\n📊 Predicciones por clase:")
        predictions = model.predict(X_test, verbose=0)
        predicted_classes = np.argmax(predictions, axis=1)
        
        for class_idx, class_name in enumerate(self.class_names):
            mask = y_test == class_idx
            if np.any(mask):
                class_predictions = predicted_classes[mask]
                accuracy = np.mean(class_predictions == class_idx)
                print(f"   - {class_name}: {accuracy:.1%} precisión")
        
        # Guardar configuración
        config = {
            'class_names': self.class_names,
            'frames_per_sample': self.frames_per_sample,
            'input_shape': list(input_shape),
            'test_accuracy': float(test_acc),
            'num_classes': len(self.class_names)
        }
        
        Path('models').mkdir(exist_ok=True)
        with open('models/model_config.json', 'w') as f:
            json.dump(config, f, indent=4)
        
        print(f"\n💾 Modelo y configuración guardados en 'models/'")
        print(f"📝 Archivo de config: models/model_config.json")
        
        return model, history
    
    def test_realtime(self):
        """Prueba el modelo en tiempo real"""
        print("\n🎥 MODO PRUEBA EN TIEMPO REAL")
        print("Presiona 'q' para salir\n")
        
        # Cargar modelo
        try:
            model = keras.models.load_model('models/sign_language_model.keras')
            with open('models/model_config.json', 'r') as f:
                config = json.load(f)
            print(f"✅ Modelo cargado")
            print(f"📊 Clases reconocidas: {config['class_names']}")
        except:
            print("❌ No se encontró el modelo. Entrena primero.")
            return
        
        cap = cv2.VideoCapture(0)
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
        
        sequence = []
        predictions_history = []
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            frame = cv2.flip(frame, 1)
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.hands.process(frame_rgb)
            
            prediction_text = "Esperando mano..."
            confidence = 0
            all_probabilities = []
            
            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    # Dibujar landmarks
                    self.mp_drawing.draw_landmarks(
                        frame, hand_landmarks, self.mp_hands.HAND_CONNECTIONS,
                        self.mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                        self.mp_drawing.DrawingSpec(color=(255, 0, 0), thickness=2)
                    )
                    
                    # Extraer y normalizar landmarks
                    landmarks = self.extract_landmarks(hand_landmarks)
                    landmarks = self.normalize_landmarks(landmarks)
                    sequence.append(landmarks)
                    
                    # Mantener solo los últimos N frames
                    if len(sequence) > self.frames_per_sample:
                        sequence.pop(0)
                    
                    # Predecir cuando tenemos suficientes frames
                    if len(sequence) == self.frames_per_sample:
                        input_data = np.expand_dims(sequence, axis=0)
                        predictions = model.predict(input_data, verbose=0)[0]
                        all_probabilities = predictions
                        
                        class_idx = np.argmax(predictions)
                        confidence = predictions[class_idx]
                        
                        # Suavizar predicciones
                        predictions_history.append(class_idx)
                        if len(predictions_history) > 10:
                            predictions_history.pop(0)
                        
                        # Usar la clase más común en el historial
                        if len(predictions_history) >= 5:
                            from collections import Counter
                            most_common = Counter(predictions_history).most_common(1)[0][0]
                            prediction_text = self.class_names[most_common]
            else:
                sequence = []
                predictions_history = []
            
            # Interfaz
            color = (0, 255, 0) if confidence > 0.8 else (0, 165, 255) if confidence > 0.5 else (0, 0, 255)
            
            # Panel principal
            cv2.rectangle(frame, (10, 10), (500, 120), (0, 0, 0), -1)
            cv2.rectangle(frame, (10, 10), (500, 120), color, 2)
            
            cv2.putText(frame, f"Prediccion: {prediction_text}", 
                       (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)
            cv2.putText(frame, f"Confianza: {confidence:.1%}", 
                       (20, 85), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            cv2.putText(frame, f"Frames: {len(sequence)}/{self.frames_per_sample}", 
                       (20, 110), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 2)
            
            # Panel de probabilidades
            if len(all_probabilities) > 0:
                y_offset = 140
                cv2.rectangle(frame, (10, y_offset - 10), (350, y_offset + 25 * len(self.class_names)), (0, 0, 0), -1)
                
                for idx, (class_name, prob) in enumerate(zip(self.class_names, all_probabilities)):
                    text = f"{class_name}: {prob*100:.1f}%"
                    color_prob = (0, 255, 0) if idx == np.argmax(all_probabilities) else (200, 200, 200)
                    cv2.putText(frame, text, 
                               (20, y_offset + idx * 25), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.5, color_prob, 1)
            
            cv2.imshow('Reconocimiento en Tiempo Real - 4 Señas', frame)
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        
        cap.release()
        cv2.destroyAllWindows()

# ============================================
# MENÚ PRINCIPAL
# ============================================

def main():
    print("=" * 70)
    print("🤟 ENTRENADOR DE LENGUAJE DE SEÑAS - 4 SEÑAS")
    print("=" * 70)
    
    trainer = HandSignTrainer()
    
    while True:
        print("\n" + "=" * 70)
        print("📋 MENÚ PRINCIPAL")
        print("=" * 70)
        print("1. 📹 Capturar datos para 'HOLA'")
        print("2. 📹 Capturar datos para 'GRACIAS'")
        print("3. 📹 Capturar datos para 'ADIOS'")
        print("4. 📹 Capturar datos para 'MUCHO GUSTO'")
        print("5. 🎓 Entrenar modelo")
        print("6. 🎥 Probar modelo en tiempo real")
        print("7. 📊 Ver estadísticas de datos")
        print("8. 🚪 Salir")
        print("=" * 70)
        
        choice = input("\n👉 Selecciona una opción (1-8): ").strip()
        
        if choice == '1':
            num_samples = input("¿Cuántas muestras? (recomendado: 50): ").strip()
            num_samples = int(num_samples) if num_samples.isdigit() else 50
            trainer.capture_training_data('hola', num_samples)
            
        elif choice == '2':
            num_samples = input("¿Cuántas muestras? (recomendado: 50): ").strip()
            num_samples = int(num_samples) if num_samples.isdigit() else 50
            trainer.capture_training_data('gracias', num_samples)
            
        elif choice == '3':
            num_samples = input("¿Cuántas muestras? (recomendado: 50): ").strip()
            num_samples = int(num_samples) if num_samples.isdigit() else 50
            trainer.capture_training_data('adios', num_samples)
            
        elif choice == '4':
            num_samples = input("¿Cuántas muestras? (recomendado: 50): ").strip()
            num_samples = int(num_samples) if num_samples.isdigit() else 50
            trainer.capture_training_data('mucho_gusto', num_samples)
            
        elif choice == '5':
            epochs = input("¿Cuántas épocas? (recomendado: 50): ").strip()
            epochs = int(epochs) if epochs.isdigit() else 50
            trainer.train_model(epochs)
            
        elif choice == '6':
            trainer.test_realtime()
            
        elif choice == '7':
            print("\n📊 ESTADÍSTICAS DE DATOS")
            print("=" * 70)
            total_samples = 0
            for class_name in trainer.class_names:
                files = list(trainer.data_dir.glob(f"{class_name}_*.npy"))
                class_samples = sum([len(np.load(f)) for f in files]) if files else 0
                total_samples += class_samples
                status = "✅" if class_samples >= 50 else "⚠️" if class_samples > 0 else "❌"
                print(f"   {status} {class_name}: {len(files)} archivos, {class_samples} muestras")
            print(f"\n📊 Total: {total_samples} muestras en {len(trainer.class_names)} clases")
            
            if total_samples == 0:
                print("\n⚠️  No hay datos capturados. Comienza capturando muestras.")
            elif total_samples < len(trainer.class_names) * 50:
                print("\n⚠️  Se recomienda al menos 50 muestras por clase para un buen entrenamiento.")
            
        elif choice == '8':
            print("\n👋 ¡Hasta luego!")
            break
            
        else:
            print("❌ Opción no válida")

if __name__ == "__main__":
    main()