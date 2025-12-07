from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import json
import mediapipe as mp

app = Flask(__name__)
CORS(app)

# Cargar modelo
model = tf.keras.models.load_model('models/sign_language_model.keras')
with open('models/model_config.json', 'r') as f:
    config = json.load(f)

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.7
)

def extract_landmarks(hand_landmarks):
    landmarks = []
    for landmark in hand_landmarks.landmark:
        landmarks.extend([landmark.x, landmark.y, landmark.z])
    return np.array(landmarks)

def normalize_landmarks(landmarks):
    landmarks = landmarks.reshape(-1, 3)
    wrist = landmarks[0]
    normalized = landmarks - wrist
    return normalized.flatten()

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    sequence = np.array(data['sequence'])
    
    predictions = model.predict(np.expand_dims(sequence, axis=0), verbose=0)[0]
    class_idx = int(np.argmax(predictions))
    confidence = float(predictions[class_idx])
    
    return jsonify({
        'prediction': config['class_names'][class_idx],
        'confidence': confidence,
        'probabilities': {name: float(pred) for name, pred in zip(config['class_names'], predictions)}
    })

@app.route('/config', methods=['GET'])
def get_config():
    return jsonify(config)

if __name__ == '__main__':
    print("🚀 API iniciada en http://localhost:5000")
    app.run(port=5000, debug=True)