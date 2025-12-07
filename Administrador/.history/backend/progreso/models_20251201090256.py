"""
Models para la app progreso
Ubicación: backend/progreso/models.py
"""

from django.db import models
from usuarios.models import Usuario
from diccionario.models import DiccionarioSeña
from ejercicios.models import SesionPractica


class ProgresoUsuario(models.Model):
    NIVEL_DOMINIO_CHOICES = [
        ('novato', 'Novato'),
        ('intermedio', 'Intermedio'),
        ('avanzado', 'Avanzado'),
        ('experto', 'Experto'),
    ]

    id_progreso = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='progreso_señas'
    )
    id_seña = models.ForeignKey(
        DiccionarioSeña,
        on_delete=models.CASCADE,
        related_name='progreso'
    )
    veces_practicada = models.IntegerField(default=0)
    veces_correcta = models.IntegerField(default=0)
    veces_incorrecta = models.IntegerField(default=0)
    porcentaje_aciertos = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )
    racha_actual = models.IntegerField(default=0)
    mejor_racha = models.IntegerField(default=0)
    ultima_practica = models.DateTimeField(null=True, blank=True)
    nivel_dominio = models.CharField(
        max_length=20,
        choices=NIVEL_DOMINIO_CHOICES,
        default='novato'
    )
    tiempo_total_practica_segundos = models.IntegerField(default=0)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'progreso_usuario'
        verbose_name = 'Progreso de Usuario'
        verbose_name_plural = 'Progreso de Usuarios'
        unique_together = ['id_usuario', 'id_seña']
        ordering = ['-fecha_actualizacion']
        indexes = [
            models.Index(fields=['id_usuario']),
            models.Index(fields=['id_seña']),
            models.Index(fields=['nivel_dominio']),
        ]

    def __str__(self):
        return f"{self.id_usuario.nombre} - {self.id_seña.palabra}"

    def calcular_porcentaje_aciertos(self):
        if self.veces_practicada == 0:
            return 0
        return (self.veces_correcta / self.veces_practicada) * 100


class HistorialDetecciones(models.Model):
    CONTEXTO_CHOICES = [
        ('ejercicio', 'Ejercicio'),
        ('conversacion', 'Conversación'),
        ('practica_libre', 'Práctica Libre'),
        ('tutorial', 'Tutorial'),
    ]

    id_deteccion = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='detecciones'
    )
    id_seña_detectada = models.ForeignKey(
        DiccionarioSeña,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    confianza = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Porcentaje 0-100"
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    contexto = models.CharField(
        max_length=50,
        choices=CONTEXTO_CHOICES,
        blank=False
    )
    id_contexto = models.IntegerField(null=True, blank=True)
    duracion_ms = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'historial_detecciones'
        verbose_name = 'Historial de Detección'
        verbose_name_plural = 'Historial de Detecciones'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['id_usuario']),
            models.Index(fields=['id_seña_detectada']),
            models.Index(fields=['timestamp']),
        ]

    def __str__(self):
        return f"Detección - {self.id_usuario.nombre} ({self.confianza}%)"


class ErroresUsuario(models.Model):
    TIPO_ERROR_CHOICES = [
        ('seña_incorrecta', 'Seña Incorrecta'),
        ('no_detectada', 'No Detectada'),
        ('gesto_incompleto', 'Gesto Incompleto'),
        ('baja_confianza', 'Baja Confianza'),
    ]

    id_error = models.AutoField(primary_key=True)
    id_sesion = models.ForeignKey(
        SesionPractica,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='errores'
    )
    id_usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='errores'
    )
    id_seña_esperada = models.ForeignKey(
        DiccionarioSeña,
        on_delete=models.CASCADE,
        related_name='errores_esperada'
    )
    id_seña_detectada = models.ForeignKey(
        DiccionarioSeña,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='errores_detectada'
    )
    tipo_error = models.CharField(
        max_length=50,
        choices=TIPO_ERROR_CHOICES
    )
    descripcion_error = models.TextField(null=True, blank=True)
    confianza_deteccion = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    retroalimentacion_mostrada = models.BooleanField(default=False)

    class Meta:
        db_table = 'errores_usuario'
        verbose_name = 'Error de Usuario'
        verbose_name_plural = 'Errores de Usuarios'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['id_usuario']),
            models.Index(fields=['id_sesion']),
            models.Index(fields=['id_seña_esperada']),
        ]

    def __str__(self):
        return f"Error - {self.id_usuario.nombre} ({self.get_tipo_error_display()})"