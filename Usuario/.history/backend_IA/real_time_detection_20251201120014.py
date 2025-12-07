"""
Script mejorado para reconocimiento de lenguaje de señas en tiempo real
Probando sign_language_model.keras
"""
import cv2
import numpy as np
import mediapipe as mp
from tensorflow.keras.models import load_model
from config import MODELS_DIR, SIGNS  # Asegúrate de que SIGNS tenga tus clases
import os
from collections import Counter

# Inicializar MediaPipe
mp_holistic = mp.solutions.holistic
mp_drawing = mp.solutions.drawing_utils

def mediapipe_detection(image, model):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image.flags.writeable = False
    results = model.process(image)
    image.flags.writeable = True
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    return image, results

def draw_styled_landmarks(image, results):
    # Mano derecha
    if results.right_hand_landmarks:
        mp_drawing.draw_landmarks(
            image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
            mp_drawing.DrawingSpec(color=(80,22,10), thickness=2, circle_radius=4),
            mp_drawing.DrawingSpec(color=(80,44,121), thickness=2, circle_radius=2)
        )
    # Mano izquierda
    if results.left_hand_landmarks:
        mp_drawing.draw_landmarks(
            image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
            mp_drawing.DrawingSpec(color=(121,22,76), thickness=2, circle_radius=4),
            mp_drawing.DrawingSpec(color=(121,44,250), thickness=2, circle_radius=2)
        )
    # Pose
    if results.pose_landmarks:
        mp_drawing.draw_landmarks(
            image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS,
            mp_drawing.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=4),
            mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
        )

def extract_keypoints(results):
    pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33*4)
    lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]).flatten() if results.left_hand_landmarks else np.zeros(21*3)
    rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]).flatten() if results.right_hand_landmarks else np.zeros(21*3)
    return np.concatenate([pose, lh, rh])

def prob_viz(res, actions, input_frame, colors, max_prob_idx):
    output_frame = input_frame.copy()
    for num, prob in enumerate(res):
        color = (0, 255, 0) if num == max_prob_idx else colors[num]
        thickness = 3 if num == max_prob_idx else 2
        cv2.rectangle(output_frame, (0,60+num*40), (int(prob*100), 90+num*40), color, -1)
        cv2.putText(output_frame, f'{actions[num]}: {prob*100:.1f}%', (105, 85+num*40), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), thickness, cv2.LINE_AA)
    return output_frame

def run_detection():
    # Cambiar aquí al modelo que quieres probar
    model_path = os.path.join(MODELS_DIR, 'sign_language_model.keras')
    
    if not os.path.exists(model_path):
        print(f"❌ Error: No se encontró el modelo en {model_path}")
        return
    
    print(f"📂 Cargando modelo desde {model_path}...")
    model = load_model(model_path)
    print("✓ Modelo cargado exitosamente\n")
    
    colors = [(245,117,16), (117,245,16), (16,117,245), (245,16,117), (16,245,117), (117,16,245)]
    
    sequence, sentence, last_predictions = [], [], []
    threshold = 0.5
    smoothing_window = 15
    
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    
    print("🎥 Iniciando detección en tiempo real... Presiona 'q' para salir, 'c' para limpiar historial")
    
    with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            frame = cv2.flip(frame, 1)
            
            image, results = mediapipe_detection(frame, holistic)
            draw_styled_landmarks(image, results)
            
            keypoints = extract_keypoints(results)
            sequence.append(keypoints)
            sequence = sequence[-30:]
            
            if len(sequence) == 30:
                res = model.predict(np.expand_dims(sequence, axis=0), verbose=0)[0]
                max_prob_idx = np.argmax(res)
                max_prob = res[max_prob_idx]
                
                last_predictions.append(max_prob_idx)
                last_predictions = last_predictions[-smoothing_window:]
                
                if len(last_predictions) >= 5:
                    most_common = Counter(last_predictions).most_common(1)[0]
                    smoothed_pred = most_common[0]
                    smoothed_count = most_common[1]
                    
                    if smoothed_count >= 8 and res[smoothed_pred] > threshold:
                        if len(sentence) == 0 or SIGNS[smoothed_pred] != sentence[-1]:
                            sentence.append(SIGNS[smoothed_pred])
                            last_predictions = []
                
                image = prob_viz(res, SIGNS, image, colors, max_prob_idx)
                confidence_color = (0, 255, 0) if max_prob > threshold else (0, 165, 255)
                cv2.putText(image, f'Confianza: {max_prob*100:.1f}%', (400, 30),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, confidence_color, 2, cv2.LINE_AA)
                
                if len(sentence) > 5:
                    sentence = sentence[-5:]
                
                cv2.rectangle(image, (0,0), (640, 50), (245, 117, 16), -1)
                display_text = ' → '.join(sentence) if sentence else 'Esperando señas...'
                cv2.putText(image, display_text, (10,35), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,255), 2, cv2.LINE_AA)
            else:
                cv2.rectangle(image, (0,0), (640, 50), (100, 100, 100), -1)
                cv2.putText(image, 'Inicializando...', (10,35), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,255), 2, cv2.LINE_AA)
            
            cv2.imshow('Reconocimiento de Lenguaje de Señas', image)
            key = cv2.waitKey(10) & 0xFF
            if key == ord('q'):
                break
            elif key == ord('c'):
                sentence, last_predictions = [], []
                print("🔄 Historial limpiado")
    
    cap.release()
    cv2.destroyAllWindows()
    print(f"\n✅ Señas detectadas: {' → '.join(sentence)}" if sentence else "\n✅ Sesión finalizada")

if __name__ == "__main__":
    try:
        run_detection()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
