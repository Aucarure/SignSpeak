"""
Models para la app usuarios
Ubicación: backend/usuarios/models.py
"""

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Usuario(models.Model):
    TIPO_USUARIO_CHOICES = [
        ('oyente', 'Oyente'),
        ('sordo', 'Sordo'),
        ('mudo', 'Mudo'),
        ('sordomudo', 'Sordomudo'),
    ]

    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, blank=False)
    email = models.EmailField(unique=True, blank=False)
    contraseña  = models.CharField(max_length=255)
    tipo_usuario = models.CharField(
        max_length=20,
        choices=TIPO_USUARIO_CHOICES,
        blank=False
    )
    foto_perfil = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    ultimo_acceso = models.DateTimeField(null=True, blank=True)
    activo = models.BooleanField(default=True)
    eliminado = models.BooleanField(default=False)
    fecha_eliminacion = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'usuarios'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-fecha_registro']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['tipo_usuario']),
        ]

    def __str__(self):
        return f"{self.nombre} ({self.email})"


class ConfiguracionUsuario(models.Model):
    TAMAÑO_FUENTE_CHOICES = [
        ('pequeño', 'Pequeño'),
        ('mediano', 'Mediano'),
        ('grande', 'Grande'),
    ]

    TEMA_CHOICES = [
        ('claro', 'Claro'),
        ('oscuro', 'Oscuro'),
        ('alto_contraste', 'Alto Contraste'),
    ]

    VELOCIDAD_ANIMACIONES_CHOICES = [
        ('lenta', 'Lenta'),
        ('normal', 'Normal'),
        ('rapida', 'Rápida'),
    ]

    id_configuracion = models.AutoField(primary_key=True)
    id_usuario = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE,
        related_name='configuracion'
    )
    tamaño_fuente = models.CharField(
        max_length=20,
        choices=TAMAÑO_FUENTE_CHOICES,
        default='mediano'
    )
    tema = models.CharField(
        max_length=30,
        choices=TEMA_CHOICES,
        default='claro'
    )
    velocidad_animaciones = models.CharField(
        max_length=20,
        choices=VELOCIDAD_ANIMACIONES_CHOICES,
        default='normal'
    )
    notificaciones_habilitadas = models.BooleanField(default=True)
    sonido_habilitado = models.BooleanField(default=True)
    vibracion_habilitada = models.BooleanField(default=True)
    idioma = models.CharField(max_length=10, default='es')
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'configuraciones_usuario'
        verbose_name = 'Configuración de Usuario'
        verbose_name_plural = 'Configuraciones de Usuarios'

    def __str__(self):
        return f"Configuración de {self.id_usuario.nombre}"