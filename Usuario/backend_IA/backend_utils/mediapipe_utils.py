import mediapipe as mp
import numpy as np
import cv2
import logging
from typing import Optional, Tuple

logger = logging.getLogger(__name__)

class MediaPipeHandler:
    """
    Manejador para MediaPipe Holistic optimizado para lenguaje de señas
    """
    
    def __init__(self, 
                 static_image_mode: bool = False,
                 min_detection_confidence: float = 0.5,
                 min_tracking_confidence: float = 0.5,
                 model_complexity: int = 1):
        
        # Inicializar MediaPipe
        self.mp_holistic = mp.solutions.holistic
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_drawing_styles = mp.solutions.drawing_styles
        
        # Configurar Holistic
        self.holistic = self.mp_holistic.Holistic(
            static_image_mode=static_image_mode,
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence,
            model_complexity=model_complexity,
            smooth_landmarks=True  # Suavizado para video
        )
        
        logger.info(f"✅ MediaPipe Holistic inicializado (confianza: {min_detection_confidence})")
    
    def process_frame(self, frame: np.ndarray):
        """
        Procesa un frame con MediaPipe Holistic
        
        Args:
            frame: Imagen BGR
            
        Returns:
            Resultados de MediaPipe
        """
        try:
            # Validar frame
            if frame is None or frame.size == 0:
                logger.warning("⚠️ Frame vacío recibido")
                return type('obj', (object,), {
                    'pose_landmarks': None,
                    'left_hand_landmarks': None,
                    'right_hand_landmarks': None,
                    'face_landmarks': None
                })()
            
            # Convertir a RGB (MediaPipe requiere RGB)
            image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image_rgb.flags.writeable = False  # Mejora rendimiento
            
            # Procesar
            results = self.holistic.process(image_rgb)
            
            # Log de detecciones (solo ocasionalmente para no saturar)
            import random
            if random.random() < 0.01:  # 1% de los frames
                detections = self._count_detections(results)
                if any(detections.values()):
                    logger.debug(f"📊 Detecciones: {detections}")
            
            return results
            
        except Exception as e:
            logger.error(f"❌ Error procesando frame: {e}")
            # Devolver resultados vacíos
            return type('obj', (object,), {
                'pose_landmarks': None,
                'left_hand_landmarks': None,
                'right_hand_landmarks': None,
                'face_landmarks': None
            })()
    
    def extract_keypoints_258(self, results) -> np.ndarray:
        """
        Extrae 258 valores para modelos de lenguaje de señas:
        - Pose: 33 × 4 (x, y, z, visibility) = 132
        - Mano izquierda: 21 × 3 = 63
        - Mano derecha: 21 × 3 = 63
        Total: 258
        
        Args:
            results: Resultados de MediaPipe
            
        Returns:
            Array de 258 valores
        """
        try:
            # Pose (con visibility)
            if results.pose_landmarks:
                pose = np.array([
                    [lm.x, lm.y, lm.z, lm.visibility] 
                    for lm in results.pose_landmarks.landmark
                ], dtype=np.float32).flatten()
            else:
                pose = np.zeros(33 * 4, dtype=np.float32)
            
            # Mano izquierda
            if results.left_hand_landmarks:
                lh = np.array([
                    [lm.x, lm.y, lm.z] 
                    for lm in results.left_hand_landmarks.landmark
                ], dtype=np.float32).flatten()
            else:
                lh = np.zeros(21 * 3, dtype=np.float32)
            
            # Mano derecha
            if results.right_hand_landmarks:
                rh = np.array([
                    [lm.x, lm.y, lm.z] 
                    for lm in results.right_hand_landmarks.landmark
                ], dtype=np.float32).flatten()
            else:
                rh = np.zeros(21 * 3, dtype=np.float32)
            
            # Concatenar
            keypoints = np.concatenate([pose, lh, rh])
            
            # Validar dimensión
            if len(keypoints) != 258:
                logger.warning(f"⚠️ Keypoints dimension: {len(keypoints)} != 258")
                # Rellenar con ceros si es necesario
                if len(keypoints) < 258:
                    keypoints = np.pad(keypoints, (0, 258 - len(keypoints)))
                else:
                    keypoints = keypoints[:258]
            
            return keypoints
            
        except Exception as e:
            logger.error(f"❌ Error extrayendo keypoints: {e}")
            return np.zeros(258, dtype=np.float32)
    
    def extract_keypoints_with_face(self, results) -> np.ndarray:
        """
        Extrae keypoints con rostro (para futuras versiones):
        - Pose: 33 × 3 = 99
        - Rostro: 468 × 3 = 1404
        - Manos: 42 × 3 = 126
        Total: 1629
        """
        try:
            # Pose (sin visibility)
            pose = np.array([
                [lm.x, lm.y, lm.z] 
                for lm in results.pose_landmarks.landmark
            ]).flatten() if results.pose_landmarks else np.zeros(33 * 3)
            
            # Rostro (muchos puntos, considerar si es necesario)
            face = np.array([
                [lm.x, lm.y, lm.z] 
                for lm in results.face_landmarks.landmark
            ]).flatten() if results.face_landmarks else np.zeros(468 * 3)
            
            # Manos
            lh = np.array([
                [lm.x, lm.y, lm.z] 
                for lm in results.left_hand_landmarks.landmark
            ]).flatten() if results.left_hand_landmarks else np.zeros(21 * 3)
            
            rh = np.array([
                [lm.x, lm.y, lm.z] 
                for lm in results.right_hand_landmarks.landmark
            ]).flatten() if results.right_hand_landmarks else np.zeros(21 * 3)
            
            return np.concatenate([pose, face, lh, rh])
            
        except Exception as e:
            logger.error(f"❌ Error extrayendo keypoints con rostro: {e}")
            return np.zeros(1629)
    
    def _count_detections(self, results) -> dict:
        """Contar cuántos landmarks se detectaron"""
        return {
            "pose": 33 if results.pose_landmarks else 0,
            "left_hand": 21 if results.left_hand_landmarks else 0,
            "right_hand": 21 if results.right_hand_landmarks else 0,
            "face": 468 if results.face_landmarks else 0
        }
    
    def draw_landmarks(self, image: np.ndarray, results, 
                      draw_pose: bool = True,
                      draw_face: bool = False,
                      draw_hands: bool = True) -> np.ndarray:
        """
        Dibuja landmarks en la imagen para visualización
        
        Args:
            image: Imagen BGR
            results: Resultados de MediaPipe
            draw_pose: Dibujar pose
            draw_face: Dibujar rostro (puede ser lento)
            draw_hands: Dibujar manos
            
        Returns:
            Imagen con landmarks
        """
        try:
            # Convertir a RGB para dibujar
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            image_rgb.flags.writeable = True
            
            # Dibujar pose
            if draw_pose and results.pose_landmarks:
                self.mp_drawing.draw_landmarks(
                    image_rgb,
                    results.pose_landmarks,
                    self.mp_holistic.POSE_CONNECTIONS,
                    landmark_drawing_spec=self.mp_drawing_styles
                    .get_default_pose_landmarks_style()
                )
            
            # Dibujar manos
            if draw_hands:
                if results.left_hand_landmarks:
                    self.mp_drawing.draw_landmarks(
                        image_rgb,
                        results.left_hand_landmarks,
                        self.mp_holistic.HAND_CONNECTIONS,
                        landmark_drawing_spec=self.mp_drawing_styles
                        .get_default_hand_landmarks_style(),
                        connection_drawing_spec=self.mp_drawing_styles
                        .get_default_hand_connections_style()
                    )
                
                if results.right_hand_landmarks:
                    self.mp_drawing.draw_landmarks(
                        image_rgb,
                        results.right_hand_landmarks,
                        self.mp_holistic.HAND_CONNECTIONS,
                        landmark_drawing_spec=self.mp_drawing_styles
                        .get_default_hand_landmarks_style(),
                        connection_drawing_spec=self.mp_drawing_styles
                        .get_default_hand_connections_style()
                    )
            
            # Convertir de vuelta a BGR
            return cv2.cvtColor(image_rgb, cv2.COLOR_RGB2BGR)
            
        except Exception as e:
            logger.error(f"❌ Error dibujando landmarks: {e}")
            return image
    
    def close(self):
        """Liberar recursos"""
        if hasattr(self, 'holistic'):
            self.holistic.close()
            logger.info("✅ MediaPipe cerrado")
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()