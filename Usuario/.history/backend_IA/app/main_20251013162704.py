from fastapi import FastAPI, WebSocket, WebSocketDisconnect
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
    allow_origins=ALLOWED_ORIGINS,
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