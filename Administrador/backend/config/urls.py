"""
URL configuration for config project.
Ubicación: backend/config/urls.py
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

# Importar ViewSets (los crearemos después)
# from usuarios.views import UsuarioViewSet
# from diccionario.views import DiccionarioViewSet
# from ejercicios.views import EjercicioViewSet
# from progreso.views import ProgresoViewSet

# router = DefaultRouter()
# router.register(r'usuarios', UsuarioViewSet)
# router.register(r'diccionario', DiccionarioViewSet)
# router.register(r'ejercicios', EjercicioViewSet)
# router.register(r'progreso', ProgresoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include([
        # path('', include(router.urls)),
        path('usuarios/', include('usuarios.urls')),
        path('diccionario/', include('diccionario.urls')),
        path('ejercicios/', include('ejercicios.urls')),
        path('progreso/', include('progreso.urls')),
        path('reportes/', include('reportes.urls')),
    ])),
]

# Servir archivos de media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)