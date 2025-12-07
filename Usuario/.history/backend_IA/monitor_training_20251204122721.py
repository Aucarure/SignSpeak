import matplotlib.pyplot as plt
import numpy as np

def plot_training_history(history_path='models/training_history_updated.npy'):
    history = np.load(history_path, allow_pickle=True).item()
    
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))
    
    # Accuracy
    axes[0, 0].plot(history['new']['accuracy'], label='Train')
    axes[0, 0].plot(history['new']['val_accuracy'], label='Validation')
    axes[0, 0].set_title('Model Accuracy')
    axes[0, 0].legend()
    
    # Loss
    axes[0, 1].plot(history['new']['loss'], label='Train')
    axes[0, 1].plot(history['new']['val_loss'], label='Validation')
    axes[0, 1].set_title('Model Loss')
    axes[0, 1].legend()
    
    plt.tight_layout()
    plt.savefig('training_progress.png')
    print("Gráfico guardado en training_progress.png")

if __name__ == "__main__":
    plot_training_history()