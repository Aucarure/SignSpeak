import React, { useEffect, useRef, useState } from "react";

const CameraComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = useState("Esperando...");

  // Iniciar cámara
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
      }
    };
    startCamera();
  }, []);

  // Enviar frame al backend cada 2 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      captureFrame();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const captureFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Dibujar frame actual del video en el canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir el canvas a blob (imagen)
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("frame", blob, "frame.jpg");

      try {
        const response = await fetch("http://127.0.0.1:8000/predict_frame", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Error al conectar con el backend");
        const data = await response.json();
        setPrediction(data.prediction || "No se detectó nada");
      } catch (error) {
        console.error("Error al enviar frame:", error);
        setPrediction("Error en la detección");
      }
    }, "image/jpeg");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>🤖 Detección de Señas en Tiempo Real</h2>
      <video ref={videoRef} autoPlay playsInline width="480" height="360" />
      <canvas ref={canvasRef} width="480" height="360" style={{ display: "none" }} />
      <h3>Predicción actual:</h3>
      <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{prediction}</p>
    </div>
  );
};

export default CameraComponent;
