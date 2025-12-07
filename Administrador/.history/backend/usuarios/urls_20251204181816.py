from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet

# Crear el router
router = DefaultRouter()

# Registrar el viewset SIN prefijo adicional
router.register(r'usuarios', UsuarioViewSet, basename='usuario')

# Las URLs finales serán: /api/usuarios/
urlpatterns = [
    path('', include(router.urls)),
]