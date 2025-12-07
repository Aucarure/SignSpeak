# ============================================
# ARCHIVO: backend/usuarios/views.py
# Ubicación: backend/usuarios/views.py
# REEMPLAZA TODO EL CONTENIDO
# ============================================

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Usuario, ConfiguracionUsuario
from .serializers import (
    UsuarioSerializer,
    UsuarioCreateUpdateSerializer,
    UsuarioListSerializer,
    ConfiguracionUsuarioSerializer,
)
import logging

logger = logging.getLogger(__name__)


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.filter(eliminado=False)  # Solo usuarios no eliminados
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['tipo_usuario', 'activo']
    search_fields = ['nombre', 'email']
    ordering_fields = ['fecha_registro', 'nombre']
    ordering = ['-fecha_registro']

    def get_serializer_class(self):
        if self.action == 'list':
            return UsuarioListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return UsuarioCreateUpdateSerializer
        return UsuarioSerializer

    def perform_create(self, serializer):
        usuario = serializer.save()
        logger.info(f"Nuevo usuario creado: {usuario.email}")

    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        total_usuarios = Usuario.objects.filter(eliminado=False).count()
        usuarios_activos = Usuario.objects.filter(activo=True, eliminado=False).count()
        usuarios_inactivos = Usuario.objects.filter(activo=False, eliminado=False).count()
        
        por_tipo = {}
        for tipo, _ in Usuario.TIPO_USUARIO_CHOICES:
            por_tipo[tipo] = Usuario.objects.filter(
                tipo_usuario=tipo,
                eliminado=False
            ).count()

        return Response({
            'total_usuarios': total_usuarios,
            'usuarios_activos': usuarios_activos,
            'usuarios_inactivos': usuarios_inactivos,
            'por_tipo': por_tipo,
        })

    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        """Cambiar estado activo/inactivo de un usuario"""
        usuario = self.get_object()
        nuevo_estado = request.data.get('activo')
        
        if nuevo_estado is None:
            return Response(
                {'error': 'Campo activo requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        usuario.activo = bool(nuevo_estado)
        usuario.save()
        logger.info(f"Estado de {usuario.email} cambió a: {nuevo_estado}")
        
        serializer = UsuarioSerializer(usuario)
        return Response({
            'mensaje': f"Usuario {'activado' if nuevo_estado else 'desactivado'}",
            'usuario': serializer.data
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post', 'delete'])
    def eliminar_logico(self, request, pk=None):
        """Eliminar usuario de forma lógica (soft delete)"""
        usuario = self.get_object()
        usuario.eliminado = True
        usuario.fecha_eliminacion = timezone.now()
        usuario.activo = False  # También desactivar
        usuario.save()
        logger.info(f"Usuario {usuario.email} marcado como eliminado")
        
        return Response({
            'mensaje': 'Usuario eliminado correctamente'
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get', 'put', 'patch'])
    def configuracion(self, request, pk=None):
        """Obtener o actualizar configuración del usuario"""
        usuario = self.get_object()
        
        try:
            config = usuario.configuracion
        except ConfiguracionUsuario.DoesNotExist:
            config = ConfiguracionUsuario.objects.create(id_usuario_id=usuario.id_usuario)


        if request.method in ['PUT', 'PATCH']:
            serializer = ConfiguracionUsuarioSerializer(
                config,
                data=request.data,
                partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer = ConfiguracionUsuarioSerializer(config)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def registro_reciente(self, request):
        """Obtener últimos 10 usuarios registrados"""
        usuarios = Usuario.objects.filter(
            eliminado=False
        ).order_by('-fecha_registro')[:10]
        
        serializer = UsuarioListSerializer(usuarios, many=True)
        return Response(serializer.data)