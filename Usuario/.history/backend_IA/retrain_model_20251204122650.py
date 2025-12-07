import numpy as np
import tensorflow as tf
from tensorflow import keras
from pathlib import Path
import json

class ModelRetrainer:
    def __init__(self, model_path='models/best_model.keras'):
        self.model_path = Path(model_path)
        self.model = None
        self.history = None
        
    def load_existing_model(self):
        """Carga el modelo existente"""
        print(f"Cargando modelo desde {self.model_path}")
        self.model = keras.models.load_model(self.model_path)
        print("Modelo cargado exitosamente")
        return self.model
    
    def load_training_history(self, history_path='models/training_history.npy'):
        """Carga el historial previo si existe"""
        try:
            self.history = np.load(history_path, allow_pickle=True).item()
            print("Historial de entrenamiento cargado")
        except:
            print("No se encontró historial previo")
            self.history = {}
    
    def prepare_data(self, new_data_path):
        """
        Prepara nuevos datos para entrenamiento
        Ajusta según tu formato de datos
        """
        # Ejemplo: Si tienes imágenes
        from tensorflow.keras.preprocessing.image import ImageDataGenerator
        
        datagen = ImageDataGenerator(
            rescale=1./255,
            validation_split=0.2,
            rotation_range=10,
            width_shift_range=0.1,
            height_shift_range=0.1,
            zoom_range=0.1
        )
        
        train_generator = datagen.flow_from_directory(
            new_data_path,
            target_size=(224, 224),  # Ajusta según tu modelo
            batch_size=32,
            class_mode='categorical',
            subset='training'
        )
        
        val_generator = datagen.flow_from_directory(
            new_data_path,
            target_size=(224, 224),
            batch_size=32,
            class_mode='categorical',
            subset='validation'
        )
        
        return train_generator, val_generator
    
    def retrain(self, train_data, val_data, epochs=10, learning_rate=0.0001):
        """Reentrena el modelo con nuevos datos"""
        
        # Opción 1: Congelar capas iniciales (transfer learning)
        for layer in self.model.layers[:-5]:  # Congela todas menos las últimas 5
            layer.trainable = False
        
        # Recompilar con tasa de aprendizaje más baja
        self.model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=learning_rate),
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        # Callbacks
        callbacks = [
            keras.callbacks.ModelCheckpoint(
                'models/retrained_model_{epoch:02d}.keras',
                save_best_only=True,
                monitor='val_accuracy'
            ),
            keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=5,
                restore_best_weights=True
            ),
            keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=3
            )
        ]
        
        # Entrenar
        print("Iniciando reentrenamiento...")
        new_history = self.model.fit(
            train_data,
            validation_data=val_data,
            epochs=epochs,
            callbacks=callbacks
        )
        
        return new_history
    
    def save_model(self, save_path='models/best_model_retrained.keras'):
        """Guarda el modelo reentrenado"""
        self.model.save(save_path)
        print(f"Modelo guardado en {save_path}")
    
    def save_history(self, new_history, history_path='models/training_history_updated.npy'):
        """Combina y guarda el historial"""
        combined_history = {
            'previous': self.history,
            'new': new_history.history
        }
        np.save(history_path, combined_history)
        print(f"Historial guardado en {history_path}")

# Uso
if __name__ == "__main__":
    # Inicializar
    retrainer = ModelRetrainer('models/best_model.keras')
    
    # Cargar modelo existente
    retrainer.load_existing_model()
    retrainer.load_training_history()
    
    # Preparar nuevos datos
    train_data, val_data = retrainer.prepare_data('training_data/nuevas_imagenes')
    
    # Reentrenar
    history = retrainer.retrain(
        train_data, 
        val_data, 
        epochs=20,
        learning_rate=0.00001  # Tasa baja para fine-tuning
    )
    
    # Guardar
    retrainer.save_model('models/best_model.keras')  # Sobrescribe o usa otro nombre
    retrainer.save_history(history)