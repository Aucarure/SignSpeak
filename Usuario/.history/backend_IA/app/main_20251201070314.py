from fastapi import FastAPI, WebSocket, WebSocketDisconnect, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import base64
import json
from .model_service import SignLanguageDetector
from .config import ALLOWED_ORIGINS

app = FastAPI(title="SignSpeak API")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todas las origins para desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instancia del detector
detector = None

@app.on_event("startup")
async def startup_event():
    global detector
    print("🚀 Iniciando SignSpeak Backend...")
    try:
        detector = SignLanguageDetector()
        print("✅ Sistema listo")
    except Exception as e:
        print(f"❌ Error en startup: {e}")
        raise

@app.get("/")
async def root():
    return {"message": "SignSpeak API está funcionando", "status": "ok"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": detector is not None
    }

# ============================================
# 🆕 NUEVO ENDPOINT PARA ANDROID
# ============================================
@app.post("/api/predict")
async def predict_sign(file: UploadFile = File(...)):
    """
    Endpoint HTTP para recibir imagen desde Android
    Parámetro: 'file' (MultipartFile)
    Respuesta: JSON con predicción
    """
    try:
        # Leer bytes de la imagen
        contents = await file.read()
        
        # Convertir a formato OpenCV
        nparr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return {
                "success": False,
                "error": "No se pudo decodificar la imagen",
                "prediction": None,
                "confidence": 0.0
            }
        
        # Detectar seña
        result = detector.detect_sign(frame)
        
        # Formatear respuesta para Android
        response = {
            "success": True,
            "prediction": result.get("prediction"),
            "confidence": result.get("confidence", 0.0),
            "handDetected": result.get("hand_detected", False),
            "poseDetected": result.get("pose_detected", False),
            "sequenceProgress": result.get("sequence_progress", 0),
            "sequenceTotal": result.get("sequence_total", 30),
            "error": result.get("error")
        }
        
        return response
        
    except Exception as e:
        print(f"❌ Error en predict_sign: {e}")
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e),
            "prediction": None,
            "confidence": 0.0
        }

# ============================================
# WEBSOCKET ORIGINAL (mantener para React)
# ============================================
@app.websocket("/ws/detect")
async def websocket_detect(websocket: WebSocket):
    await websocket.accept()
    print("🔗 Cliente conectado")
    
    try:
        while True:
            # Recibir datos del cliente
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Extraer imagen base64
            img_base64 = message.get("image", "")
            
            if not img_base64:
                await websocket.send_json({"error": "No image provided"})
                continue
            
            try:
                # Decodificar imagen
                if "," in img_base64:
                    img_base64 = img_base64.split(",")[1]
                
                img_bytes = base64.b64decode(img_base64)
                img_array = np.frombuffer(img_bytes, dtype=np.uint8)
                frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
                
                if frame is None:
                    await websocket.send_json({"error": "Invalid image format"})
                    continue
                
                # Detectar seña
                result = detector.detect_sign(frame)
                
                # Enviar resultado
                await websocket.send_json(result)
                
            except Exception as e:
                print(f"❌ Error procesando frame: {e}")
                await websocket.send_json({"error": str(e)})
                
    except WebSocketDisconnect:
        print("🔌 Cliente desconectado")
    except Exception as e:
        print(f"❌ Error en WebSocket: {e}")