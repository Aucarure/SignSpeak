from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import CategoriaSeña, DiccionarioSeña
from .serializers import (
    CategoriaSeñaSerializer,
    DiccionarioSeñaSerializer,
    DiccionarioSeñaListSerializer,
)
import logging

logger = logging.getLogger(__name__)


class CategoriaSeñaViewSet(viewsets.ModelViewSet):
    queryset = CategoriaSeña.objects.filter(activo=True).order_by('orden')
    serializer_class = CategoriaSeñaSerializer
    permission_classes = [AllowAny]


class DiccionarioSeñaViewSet(viewsets.ModelViewSet):
    queryset = DiccionarioSeña.objects.filter(activo=True)
    serializer_class = DiccionarioSeñaSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['dificultad', 'id_categoria']
    search_fields = ['palabra', 'descripcion', 'etiquetas']
    ordering_fields = ['palabra', 'popularidad', 'fecha_creacion']
    ordering = ['palabra']

    def get_serializer_class(self):
        if self.action == 'list':
            return DiccionarioSeñaListSerializer
        return DiccionarioSeñaSerializer

    @action(detail=False, methods=['get'])
    def por_categoria(self, request):
        categorias = CategoriaSeña.objects.filter(activo=True)
        resultado = []

        for categoria in categorias:
            señas = DiccionarioSeña.objects.filter(
                id_categoria=categoria,
                activo=True
            )
            resultado.append({
                'categoria': CategoriaSeñaSerializer(categoria).data,
                'señas': DiccionarioSeñaListSerializer(señas, many=True).data,
            })

        return Response(resultado)

    @action(detail=False, methods=['get'])
    def mas_practicadas(self, request):
        señas = DiccionarioSeña.objects.filter(
            activo=True
        ).order_by('-veces_practicada')[:10]
        
        serializer = DiccionarioSeñaSerializer(señas, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def mas_populares(self, request):
        señas = DiccionarioSeña.objects.filter(
            activo=True
        ).order_by('-popularidad')[:10]
        
        serializer = DiccionarioSeñaSerializer(señas, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def incrementar_practicas(self, request, pk=None):
        seña = self.get_object()
        seña.veces_practicada += 1
        seña.save()
        
        return Response({
            'veces_practicada': seña.veces_practicada
        })

