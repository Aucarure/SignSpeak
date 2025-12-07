"""
Serializers para la app diccionario
Ubicación: backend/diccionario/serializers.py
"""

from rest_framework import serializers
from .models import CategoriaSeña, DiccionarioSeña


class CategoriaSeñaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaSeña
        fields = [
            'id_categoria',
            'nombre',
            'descripcion',
            'icono',
            'orden',
            'activo',
            'fecha_creacion',
        ]


class DiccionarioSeñaSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(
        source='id_categoria.nombre',
        read_only=True
    )

    class Meta:
        model = DiccionarioSeña
        fields = [
            'id_seña',
            'palabra',
            'descripcion',
            'id_categoria',
            'categoria_nombre',
            'url_video',
            'url_imagen',
            'url_animacion',
            'duracion_video_segundos',
            'dificultad',
            'popularidad',
            'veces_practicada',
            'etiquetas',
            'activo',
            'fecha_creacion',
            'fecha_actualizacion',
        ]
        read_only_fields = [
            'id_seña',
            'fecha_creacion',
            'fecha_actualizacion',
        ]


class DiccionarioSeñaListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listados"""
    
    class Meta:
        model = DiccionarioSeña
        fields = [
            'id_seña',
            'palabra',
            'dificultad',
            'popularidad',
            'veces_practicada',
        ]