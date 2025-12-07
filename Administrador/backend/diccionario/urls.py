from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaSeñaViewSet, DiccionarioSeñaViewSet

router = DefaultRouter()
router.register(r'categorias', CategoriaSeñaViewSet, basename='categoria')
router.register(r'señas', DiccionarioSeñaViewSet, basename='seña')

urlpatterns = [
    path('', include(router.urls)),
]