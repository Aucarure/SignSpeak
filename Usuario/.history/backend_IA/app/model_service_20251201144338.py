import cv2
import numpy as np
import logging
from collections import deque
from typing import Dict, Any, Optional, List
from datetime import datetime

# Importaciones de TensorFlow con manejo de errores
try:
    from tensorflow import keras
    TENSORFLOW_AVAILABLE = True
except ImportError as e:
    logging.warning(f"TensorFlow no disponible: {e}")
    TENSORFLOW_AVAILABLE = False

# Importaciones locales
from config import (
    ACTUAL_MODEL_PATH, 
    SEQUENCE_LENGTH, 
    CLASSES,
    DETECTOR_CONFIG,
    MEDIAPIPE_CONFIG
)

# Intentar importar backend_utils
try:
    from backend_utils.mediapipe_utils import MediaPipeHandler
    MEDIAPIPE_AVAILABLE = True
except ImportError as e:
    logging.warning(f"MediaPipe utils no disponibles: {e}")
    MEDIAPIPE_AVAILABLE = False
    # Crear una clase dummy para evitar errores
    class MediaPipeHandler:
        def __init__(self, **kwargs):
            pass
        def process_frame(self, frame):
            return type('obj', (object,), {
                'pose_landmarks': None,
                'left_hand_landmarks': None,
                'right_hand_landmarks': None
            })()
        def extract_keypoints_258(self, results):
            return np.zeros(258)
        def close(self):
            pass

logger = logging.getLogger(__name__)

class SignLanguageDetector:
    """Detección de lenguaje de señas usando MediaPipe y modelo Keras"""
    
    def __init__(self):
        # Verificar dependencias
        if not TENSORFLOW_AVAILABLE:
            raise ImportError("TensorFlow no está instalado. Instala con: pip install tensorflow")
        
        if not MEDIAPIPE_AVAILABLE:
            raise ImportError("MediaPipe no está disponible. Verifica backend_utils")
        
        # Cargar modelo
        self.model = self._load_model()
        
        # Inicializar MediaPipe
        self.mediapipe_handler = MediaPipeHandler(**MEDIAPIPE_CONFIG)
        
        # Configuración
        self.sequence_length = SEQUENCE_LENGTH
        self.classes = CLASSES
        self.confidence_threshold = DETECTOR_CONFIG["confidence_threshold"]
        
        # Buffers y estado
        self.sequence = deque(maxlen=SEQUENCE_LENGTH)
        self.prediction_buffer = deque(maxlen=DETECTOR_CONFIG["prediction_buffer_size"])
        self.max_frames_without_hands = DETECTOR_CONFIG["max_frames_without_hands"]
        self.frames_without_hands = 0
        
        # Historial
        self.last_prediction = None
        self.last_confidence = 0.0
        self.prediction_count = 0
        
        logger.info(f"✅ SignLanguageDetector inicializado")
        logger.info(f"📊 Clases: {len(self.classes)}")
        logger.info(f"📈 Secuencia: {self.sequence_length} frames")
        logger.info(f"🎯 Umbral de confianza: {self.confidence_threshold}")
    
    def _load_model(self) -> keras.Model:
        """Cargar modelo de Keras"""
        logger.info(f"📦 Cargando modelo desde: {ACTUAL_MODEL_PATH}")
        
        if not ACTUAL_MODEL_PATH or not ACTUAL_MODEL_PATH.exists():
            raise FileNotFoundError(f"No se encontró el modelo en: {ACTUAL_MODEL_PATH}")
        
        try:
            # Cargar modelo
            model = keras.models.load_model(str(ACTUAL_MODEL_PATH), compile=False)
            
            # Verificar si necesita compilación
            if not hasattr(model, 'optimizer') or model.optimizer is None:
                model.compile(
                    optimizer='adam',
                    loss='categorical_crossentropy',
                    metrics=['accuracy']
                )
                logger.info("✅ Modelo compilado con éxito")
            
            # Log de información del modelo
            logger.info(f"📊 Arquitectura del modelo:")
            logger.info(f"   Input shape: {model.input_shape}")
            logger.info(f"   Output shape: {model.output_shape}")
            logger.info(f"   Número de parámetros: {model.count_params():,}")
            
            # Verificar compatibilidad
            expected_features = model.input_shape[-1]
            expected_classes = model.output_shape[-1]
            
            if expected_features != 258:
                logger.warning(f"⚠️ El modelo espera {expected_features} features, pero extraemos 258")
            
            if expected_classes != len(CLASSES):
                logger.warning(
                    f"⚠️ El modelo tiene {expected_classes} clases de salida, "
                    f"pero config.py define {len(CLASSES)} clases"
                )
            
            return model
            
        except Exception as e:
            logger.error(f"❌ Error cargando modelo: {e}")
            raise
    
    def detect_sign(self, frame: np.ndarray) -> Dict[str, Any]:
        """
        Procesa un frame y detecta señas
        
        Args:
            frame: Imagen BGR de OpenCV
            
        Returns:
            Diccionario con resultados
        """
        # Validar entrada
        if frame is None or frame.size == 0:
            return self._create_error_response("Frame vacío o inválido")
        
        try:
            # Procesar con MediaPipe
            results = self.mediapipe_handler.process_frame(frame)
            
            # Verificar detecciones
            hands_detected = (
                results.left_hand_landmarks is not None or 
                results.right_hand_landmarks is not None
            )
            pose_detected = results.pose_landmarks is not None
            
            # Manejar frames sin manos
            if not hands_detected:
                self.frames_without_hands += 1
                if self.frames_without_hands >= self.max_frames_without_hands:
                    self._reset_buffers()
                    logger.debug("🔄 Buffers reseteados: sin manos por mucho tiempo")
            else:
                self.frames_without_hands = 0
            
            # Extraer keypoints
            keypoints = self.mediapipe_handler.extract_keypoints_258(results)
            
            # Validar keypoints
            if keypoints.shape[0] != 258:
                logger.warning(f"⚠️ Keypoints con dimensión incorrecta: {keypoints.shape[0]}")
                return self._create_response(
                    hands_detected=hands_detected,
                    pose_detected=pose_detected,
                    error=f"Dimensiones incorrectas: {keypoints.shape[0]} != 258"
                )
            
            # Agregar a secuencia
            self.sequence.append(keypoints)
            
            # Crear respuesta base
            response = self._create_response(
                hands_detected=hands_detected,
                pose_detected=pose_detected
            )
            
            # Predecir si tenemos secuencia completa
            if len(self.sequence) == self.sequence_length:
                # Preparar datos para el modelo
                X = np.array([list(self.sequence)])  # Shape: (1, sequence_length, 258)
                
                # Hacer predicción
                predictions = self.model.predict(X, verbose=0)[0]
                predicted_idx = int(np.argmax(predictions))
                confidence = float(predictions[predicted_idx])
                
                # Agregar al buffer de predicciones
                self.prediction_buffer.append(predicted_idx)
                
                # Usar moda si el buffer está lleno
                if len(self.prediction_buffer) == self.prediction_buffer.maxlen:
                    from collections import Counter
                    most_common = Counter(self.prediction_buffer).most_common(1)[0]
                    final_idx = most_common[0]
                    final_class = self.classes[final_idx]
                    
                    # Solo aceptar si supera el umbral
                    if confidence >= self.confidence_threshold:
                        response["prediction"] = final_class
                        response["confidence"] = confidence
                        
                        # Actualizar histórico
                        self.last_prediction = final_class
                        self.last_confidence = confidence
                        self.prediction_count += 1
                        
                        logger.debug(
                            f"✅ Predicción #{self.prediction_count}: "
                            f"{final_class} ({confidence:.1%})"
                        )
                    else:
                        logger.debug(f"⚠️ Confianza baja: {confidence:.1%} < {self.confidence_threshold}")
                        
                        # Usar última predicción válida si existe
                        if (self.last_prediction and 
                            self.last_confidence >= self.confidence_threshold):
                            response["prediction"] = self.last_prediction
                            response["confidence"] = self.last_confidence
                else:
                    logger.debug(
                        f"🔄 Buffer: {len(self.prediction_buffer)}/"
                        f"{self.prediction_buffer.maxlen}"
                    )
            else:
                logger.debug(
                    f"📊 Secuencia: {len(self.sequence)}/{self.sequence_length}"
                )
            
            return response
            
        except Exception as e:
            logger.error(f"❌ Error en detect_sign: {e}", exc_info=True)
            return self._create_error_response(str(e))
    
    def _create_response(self, 
                        hands_detected: bool = False,
                        pose_detected: bool = False,
                        error: Optional[str] = None) -> Dict[str, Any]:
        """Crear respuesta estándar"""
        response = {
            "hand_detected": hands_detected,
            "pose_detected": pose_detected,
            "prediction": None,
            "confidence": 0.0,
            "sequence_progress": len(self.sequence),
            "sequence_total": self.sequence_length,
            "timestamp": datetime.now().isoformat()
        }
        
        if error:
            response["error"] = error
        
        return response
    
    def _create_error_response(self, error_msg: str) -> Dict[str, Any]:
        """Crear respuesta de error"""
        return self._create_response(error=error_msg)
    
    def _reset_buffers(self):
        """Resetear todos los buffers"""
        self.sequence.clear()
        self.prediction_buffer.clear()
        self.frames_without_hands = 0
    
    def reset(self):
        """Resetear el detector completamente"""
        self._reset_buffers()
        self.last_prediction = None
        self.last_confidence = 0.0
        self.prediction_count = 0
        logger.info("🔄 Detector reseteado completamente")
    
    def get_stats(self) -> Dict[str, Any]:
        """Obtener estadísticas del detector"""
        return {
            "predictions_made": self.prediction_count,
            "last_prediction": self.last_prediction,
            "last_confidence": self.last_confidence,
            "sequence_length": len(self.sequence),
            "buffer_size": len(self.prediction_buffer),
            "frames_without_hands": self.frames_without_hands
        }
    
    def cleanup(self):
        """Liberar recursos"""
        if hasattr(self, 'mediapipe_handler'):
            self.mediapipe_handler.close()
            logger.info("✅ MediaPipe Handler cerrado")
    
    def __del__(self):
        """Destructor"""
        self.cleanup()