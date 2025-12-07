from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet

router = DefaultRouter()
# ⬇️ CAMBIO: Usa cadena vacía porque ya tienes 'usuarios/' en config/urls.py
router.register(r'', UsuarioViewSet, basename='usuario')

urlpatterns = [
    path('', include(router.urls)),
]