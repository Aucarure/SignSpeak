import cv2
import numpy as np
import mediapipe as mp
from tensorflow import keras
from collections import deque
from .config import MODEL_PATH, SEQUENCE_LENGTH, CLASSES

class SignLanguageDetector:
    def __init__(self):
        # Cargar modelo
        print(f"Cargando modelo desde {MODEL_PATH}")
        try:
            self.model = keras.models.load_model(
                str(MODEL_PATH),
                compile=False
            )
            self.model.compile(
                optimizer='adam',
                loss='categorical_crossentropy',
                metrics=['accuracy']
            )
            print("✅ Modelo cargado exitosamente")
            print(f"📊 Input shape esperado: {self.model.input_shape}")
        except Exception as e:
            print(f"❌ Error cargando modelo: {e}")
            raise
        
        # MediaPipe Holistic (pose + manos + cara)
        self.mp_holistic = mp.solutions.holistic
        self.holistic = self.mp_holistic.Holistic(
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Buffer para secuencias
        self.sequence = deque(maxlen=SEQUENCE_LENGTH)
        self.last_prediction = None
        self.confidence_threshold = 0.6
        
    def extract_keypoints(self, results):
        """
        Extrae 258 valores: Pose (132) + Mano Izq (63) + Mano Der (63)
        """
        # POSE: 33 landmarks × 4 valores (x, y, z, visibility) = 132
        if results.pose_landmarks:
            pose = np.array([[lm.x, lm.y, lm.z, lm.visibility] 
                           for lm in results.pose_landmarks.landmark]).flatten()
        else:
            pose = np.zeros(33 * 4)
        
        # MANO IZQUIERDA: 21 landmarks × 3 valores (x, y, z) = 63
        if results.left_hand_landmarks:
            lh = np.array([[lm.x, lm.y, lm.z] 
                          for lm in results.left_hand_landmarks.landmark]).flatten()
        else:
            lh = np.zeros(21 * 3)
        
        # MANO DERECHA: 21 landmarks × 3 valores (x, y, z) = 63
        if results.right_hand_landmarks:
            rh = np.array([[lm.x, lm.y, lm.z] 
                          for lm in results.right_hand_landmarks.landmark]).flatten()
        else:
            rh = np.zeros(21 * 3)
        
        # Concatenar todo: 132 + 63 + 63 = 258 ✅
        keypoints = np.concatenate([pose, lh, rh])
        
        return keypoints
    
    def detect_sign(self, frame):
        """Detecta seña en un frame"""
        try:
            # Convertir a RGB
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False
            
            # Procesar con MediaPipe Holistic
            results = self.holistic.process(image)
            
            # Extraer keypoints (258 valores)
            keypoints = self.extract_keypoints(results)
            
            # Verificar que tenga el tamaño correcto
            if keypoints.shape[0] != 258:
                print(f"⚠️ Error: keypoints tiene {keypoints.shape[0]} valores, esperado 258")
                return {
                    "error": f"Keypoints incorrectos: {keypoints.shape[0]}",
                    "hand_detected": False,
                    "prediction": None,
                    "confidence": 0.0
                }
            
            # Agregar a secuencia
            self.sequence.append(keypoints)
            
            # Detectar si hay manos o pose
            hands_detected = (results.left_hand_landmarks is not None or 
                            results.right_hand_landmarks is not None)
            pose_detected = results.pose_landmarks is not None
            
            # Respuesta base
            response = {
                "hand_detected": hands_detected,
                "pose_detected": pose_detected,
                "prediction": None,
                "confidence": 0.0,
                "sequence_progress": len(self.sequence),
                "sequence_total": SEQUENCE_LENGTH
            }
            
            # Predecir solo si tenemos secuencia completa
            if len(self.sequence) == SEQUENCE_LENGTH:
                # Preparar datos: (1, 30, 258)
                X = np.array([list(self.sequence)])
                
                print(f"🤖 Prediciendo con shape: {X.shape}")
                
                # Predecir
                predictions = self.model.predict(X, verbose=0)[0]
                predicted_class_idx = np.argmax(predictions)
                confidence = float(predictions[predicted_class_idx])
                
                print(f"📊 Predicción: {CLASSES[predicted_class_idx]} ({confidence:.2%})")
                
                # Solo actualizar si supera umbral
                if confidence >= self.confidence_threshold:
                    predicted_class = CLASSES[predicted_class_idx]
                    response["prediction"] = predicted_class
                    response["confidence"] = confidence
                    self.last_prediction = predicted_class
                    print(f"✅ Seña detectada: {predicted_class}")
                elif self.last_prediction:
                    # Mantener última predicción
                    response["prediction"] = self.last_prediction
                    response["confidence"] = confidence
            else:
                print(f"🔄 Acumulando frames: {len(self.sequence)}/{SEQUENCE_LENGTH}")
            
            return response
            
        except Exception as e:
            print(f"❌ Error en detección: {e}")
            import traceback
            traceback.print_exc()
            return {
                "error": str(e),
                "hand_detected": False,
                "prediction": None,
                "confidence": 0.0
            }
    
    def __del__(self):
        """Liberar recursos"""
        if hasattr(self, 'holistic'):
            self.holistic.close()