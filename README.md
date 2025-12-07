Guía de Instalación y Ejecución
Requisitos Previos

Python 3.11 (recomendado por estabilidad)
PostgreSQL configurado con contraseña
Node.js y npm instalados
Android Studio (para la aplicación móvil)
Maven (para el backend de usuario)

────────────────────────────────────────────────────────────────────────────────
Configuración para Administrador
Backend (Django)
Activar el entorno virtual:
.\venv\Scripts\activate

Instalar dependencias:
pip install -r requirements.txt

Ejecutar migraciones:
python manage.py makemigrations
python manage.py migrate

Crear un superusuario:
python manage.py createsuperuser

Ejecutar el servidor:
python manage.py runserver 8000
────────────────────────────────────────────────────────────────────────────────
Frontend
Instalar dependencias:
npm install

Ejecutar la aplicación React:
npm run dev
────────────────────────────────────────────────────────────────────────────────
Configuración para Usuario
Backend (Spring Boot)
mvn spring-boot:run
────────────────────────────────────────────────────────────────────────────────
Backend IA
Instalar dependencias:
pip install -r requirements.txt

Encender la IA:
python api.py
────────────────────────────────────────────────────────────────────────────────
Frontend
Instalar dependencias:
npm install
Ejecutar la aplicación:
npm run dev
────────────────────────────────────────────────────────────────────────────────
Aplicación Móvil
Abrir el proyecto en Android Studio y ejecutar la aplicación.
────────────────────────────────────────────────────────────────────────────────
Módulo de Autenticación (Auth)

Backend
Activar el entorno virtual:
venv\Scripts\activate

Instalar dependencias:
pip install -r requirements.txt

Ejecutar migraciones:
python manage.py makemigrations
python manage.py migrate

(Opcional) Crear un superusuario:
python manage.py createsuperuser

Ejecutar el servidor:
python manage.py runserver 8001
────────────────────────────────────────────────────────────────────────────────
Frontend
Instalar dependencias:
npm install

Ejecutar la aplicación:
npm run dev
