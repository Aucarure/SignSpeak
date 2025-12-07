from fastapi import FastAPI, WebSocket, WebSocketDisconnect, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import cv2
import numpy as np
import base64
import json
import logging
from datetime import datetime
from typing import Dict, Any

# Importaciones locales
from config import ALLOWED_ORIGINS, MAX_FILE_SIZE_MB, ACTUAL_MODEL_PATH
from model_service import SignLanguageDetector

# ========== CONFIGURACIÓN DE LOGGING ==========
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# ========== INICIALIZACIÓN DE FASTAPI ==========
app = FastAPI(
    title="SignSpeak API",
    description="API para detección de lenguaje de señas",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ========== CONFIGURACIÓN CORS ==========
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allow_headers=["*"],
    max_age=3600
)

# ========== VARIABLES GLOBALES ==========
detector = None

# ========== MANEJO DE EXCEPCIONES ==========
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "timestamp": datetime.now().isoformat()
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Error no manejado: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Error interno del servidor",
            "timestamp": datetime.now().isoformat()
        }
    )

# ========== EVENTOS DE LA APLICACIÓN ==========
@app.on_event("startup")
async def startup_event():
    """Inicializar el detector al arrancar"""
    global detector
    logger.info("🚀 Iniciando SignSpeak Backend...")
    
    try:
        if ACTUAL_MODEL_PATH is None:
            logger.error("❌ No se pudo encontrar ningún modelo")
            raise RuntimeError("Modelo no disponible. Verifique la configuración.")
        
        detector = SignLanguageDetector()
        logger.info("✅ Sistema inicializado correctamente")
        logger.info(f"📦 Modelo cargado desde: {ACTUAL_MODEL_PATH}")
        
    except Exception as e:
        logger.error(f"❌ Error crítico en startup: {e}", exc_info=True)
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """Liberar recursos al apagar"""
    global detector
    logger.info("🛑 Apagando SignSpeak Backend...")
    if detector:
        detector.cleanup()
    logger.info("✅ Recursos liberados")

# ========== ENDPOINTS ==========
@app.get("/")
async def root():
    """Endpoint raíz - Verificación de estado"""
    return {
        "message": "SignSpeak API está funcionando",
        "status": "ok",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "model_loaded": detector is not None
    }

@app.get("/health")
async def health_check():
    """Endpoint de verificación de salud"""
    return {
        "status": "healthy" if detector else "unhealthy",
        "model_loaded": detector is not None,
        "service": "sign-language-detection",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/info")
async def get_info():
    """Obtener información del sistema y modelo"""
    if not detector:
        raise HTTPException(status_code=503, detail="Servicio no disponible")
    
    return {
        "success": True,
        "model_info": {
            "path": str(ACTUAL_MODEL_PATH),
            "sequence_length": detector.sequence_length,
            "classes": detector.classes,
            "confidence_threshold": detector.confidence_threshold
        },
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/predict")
async def predict_sign(file: UploadFile = File(...)):
    """
    Endpoint HTTP para predicción desde Android/Cliente
    
    Parámetros:
    - file: Imagen en formato JPEG o PNG (max 5MB)
    
    Retorna:
    - JSON con predicción y metadatos
    """
    # Verificar servicio disponible
    if detector is None:
        raise HTTPException(status_code=503, detail="Servicio no inicializado")
    
    # Validar tipo de archivo
    allowed_types = ["image/jpeg", "image/png", "image/jpg"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Tipo de archivo no soportado. Use: {', '.join(allowed_types)}"
        )
    
    try:
        # Leer y validar tamaño
        contents = await file.read()
        file_size = len(contents)
        
        if file_size > MAX_FILE_SIZE_MB * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail=f"Imagen demasiado grande ({file_size / (1024*1024):.1f}MB). Máximo: {MAX_FILE_SIZE_MB}MB"
            )
        
        # Decodificar imagen
        nparr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            raise HTTPException(status_code=400, detail="No se pudo decodificar la imagen")
        
        # Validar dimensiones
        height, width = frame.shape[:2]
        if height < 100 or width < 100:
            logger.warning(f"Imagen pequeña recibida: {width}x{height}")
        
        # Procesar con el detector
        result = detector.detect_sign(frame)
        
        # Formatear respuesta
        response = {
            "success": True,
            "timestamp": datetime.now().isoformat(),
            "prediction": result.get("prediction"),
            "confidence": float(result.get("confidence", 0.0)),
            "handDetected": result.get("hand_detected", False),
            "poseDetected": result.get("pose_detected", False),
            "sequenceProgress": result.get("sequence_progress", 0),
            "sequenceTotal": result.get("sequence_total", 30),
            "imageInfo": {
                "width": width,
                "height": height,
                "channels": frame.shape[2] if len(frame.shape) > 2 else 1
            }
        }
        
        # Si hay error, marcar como no exitoso
        if "error" in result:
            response["success"] = False
            response["error"] = result["error"]
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error en predict_sign: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error procesando imagen: {str(e)}")

@app.websocket("/ws/detect")
async def websocket_detect(websocket: WebSocket):
    """
    WebSocket para detección en tiempo real
    """
    await websocket.accept()
    logger.info("🔗 Cliente WebSocket conectado")
    
    # Verificar detector
    if detector is None:
        await websocket.send_json({
            "success": False,
            "error": "Sistema no inicializado",
            "timestamp": datetime.now().isoformat()
        })
        await websocket.close()
        return
    
    try:
        while True:
            # Recibir mensaje
            data = await websocket.receive_text()
            
            try:
                message = json.loads(data)
            except json.JSONDecodeError as e:
                await websocket.send_json({
                    "success": False,
                    "error": f"JSON inválido: {str(e)}",
                    "timestamp": datetime.now().isoformat()
                })
                continue
            
            # Obtener imagen
            img_base64 = message.get("image", "")
            if not img_base64:
                await websocket.send_json({
                    "success": False,
                    "error": "No se proporcionó imagen",
                    "timestamp": datetime.now().isoformat()
                })
                continue
            
            try:
                # Decodificar base64
                if "," in img_base64:
                    img_base64 = img_base64.split(",")[1]
                
                img_bytes = base64.b64decode(img_base64)
                img_array = np.frombuffer(img_bytes, np.uint8)
                frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
                
                if frame is None:
                    await websocket.send_json({
                        "success": False,
                        "error": "Imagen inválida o corrupta",
                        "timestamp": datetime.now().isoformat()
                    })
                    continue
                
                # Detectar seña
                result = detector.detect_sign(frame)
                
                # Agregar metadatos
                result["timestamp"] = datetime.now().isoformat()
                result["success"] = "error" not in result
                
                # Enviar respuesta
                await websocket.send_json(result)
                
            except Exception as e:
                logger.error(f"❌ Error en WebSocket frame: {e}")
                await websocket.send_json({
                    "success": False,
                    "error": f"Error procesando imagen: {str(e)}",
                    "timestamp": datetime.now().isoformat()
                })
                
    except WebSocketDisconnect:
        logger.info("🔌 Cliente WebSocket desconectado")
    except Exception as e:
        logger.error(f"❌ Error en conexión WebSocket: {e}", exc_info=True)
        try:
            await websocket.send_json({
                "success": False,
                "error": "Error de conexión",
                "timestamp": datetime.now().isoformat()
            })
        except:
            pass