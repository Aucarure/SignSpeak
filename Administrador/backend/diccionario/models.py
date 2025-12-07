"""
Models para la app diccionario
Ubicación: backend/diccionario/models.py
"""

from django.db import models
from django.contrib.postgres.fields import ArrayField


class CategoriaSeña(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(null=True, blank=True)
    icono = models.CharField(max_length=50, null=True, blank=True)
    orden = models.IntegerField(default=0)
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'categorias_seÃ±as'
        verbose_name = 'Categoría de Seña'
        verbose_name_plural = 'Categorías de Señas'
        ordering = ['orden', 'nombre']

    def __str__(self):
        return self.nombre


class DiccionarioSeña(models.Model):
    DIFICULTAD_CHOICES = [
        ('facil', 'Fácil'),
        ('medio', 'Medio'),
        ('dificil', 'Difícil'),
    ]

    id_seña = models.AutoField(primary_key=True)
    palabra = models.CharField(max_length=100, blank=False)
    descripcion = models.TextField(null=True, blank=True)
    id_categoria = models.ForeignKey(
        CategoriaSeña,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='señas'
    )
    url_video = models.URLField(null=True, blank=True)
    url_imagen = models.URLField(null=True, blank=True)
    url_animacion = models.URLField(null=True, blank=True)
    duracion_video_segundos = models.IntegerField(null=True, blank=True)
    dificultad = models.CharField(
        max_length=20,
        choices=DIFICULTAD_CHOICES,
        default='medio'
    )
    popularidad = models.IntegerField(default=0)
    veces_practicada = models.IntegerField(default=0)
    etiquetas = ArrayField(
        models.CharField(max_length=50),
        default=list,
        blank=True,
        help_text="Etiquetas para búsqueda"
    )
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'diccionario_seÃ±as'
        verbose_name = 'Seña'
        verbose_name_plural = 'Señas'
        ordering = ['palabra']
        indexes = [
            models.Index(fields=['palabra']),
            models.Index(fields=['id_categoria']),
            models.Index(fields=['dificultad']),
        ]

    def __str__(self):
        return f"{self.palabra} ({self.get_dificultad_display()})"