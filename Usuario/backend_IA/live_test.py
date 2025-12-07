# live_test.py
import cv2
from app.model_service import SignLanguageDetector
from app.config import SEQUENCE_LENGTH
from config import SEQUENCE_LENGTH

def main():
    # Instanciar detector
    detector = SignLanguageDetector()
    
    # Abrir cámara
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("❌ No se pudo abrir la cámara")
        return
    
    print("🎥 Cámara iniciada. Presiona 'q' para salir.")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ Error capturando frame")
            break
        
        # Detectar seña
        result = detector.detect_sign(frame)
        
        # Mostrar predicción en el frame
        display_text = "Prediction: "
        if result.get("prediction"):
            display_text += f"{result['prediction']} ({result['confidence']:.2%})"
        else:
            display_text += "Detectando..."
        
        cv2.putText(frame, display_text, (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
        
        # Mostrar frame
        cv2.imshow("SignSpeak Live Test", frame)
        
        # Salir con 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()
    print("👋 Cámara cerrada. Fin de la prueba.")

if __name__ == "__main__":
    main()
