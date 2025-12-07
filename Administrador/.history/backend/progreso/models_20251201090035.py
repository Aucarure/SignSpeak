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

    id_progreso = models.AutoField(primary_key=True, db_column='id_progreso')
    id_usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='progreso_señas',
        db_column='id_usuario'
    )
    id_seña = models.ForeignKey(
        DiccionarioSeña,
        on_delete=models.CASCADE,
        related_name='progreso',
        db_column='id_seña'
    )
    veces_practicada = models.IntegerField(default=0, db_column='veces_practicada')
    veces_correcta = models.IntegerField(default=0, db_column='veces_correcta')
    veces_incorrecta = models.IntegerField(default=0, db_column='veces_incorrecta')
    porcentaje_aciertos = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        db_column='porcentaje_aciertos'
    )
    racha_actual = models.IntegerField(default=0, db_column='racha_actual')
    mejor_racha = models.IntegerField(default=0, db_column='mejor_racha')
    ultima_practica = models.DateTimeField(null=True, blank=True, db_column='ultima_practica')
    nivel_dominio = models.CharField(
        max_length=20,
        choices=NIVEL_DOMINIO_CHOICES,
        default='novato',
        db_column='nivel_dominio'
    )
    tiempo_total_practica_segundos = models.IntegerField(default=0, db_column='tiempo_total_practica_segundos')
    fecha_creacion = models.DateTimeField(auto_now_add=True, db_column='fecha_creacion')
    fecha_actualizacion = models.DateTimeField(auto_now=True, db_column='fecha_actualizacion')

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

    id_deteccion = models.AutoField(primary_key=True, db_column='id_deteccion')
    id_usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='detecciones',
        db_column='id_usuario'
    )
    id_seña_detectada = models.ForeignKey(
        DiccionarioSeña,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column='id_seña_detectada'
    )
    confianza = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Porcentaje 0-100",
        db_column='confianza'
    )
    timestamp = models.DateTimeField(auto_now_add=True, db_column='timestamp')
    contexto = models.CharField(
        max_length=50,
        choices=CONTEXTO_CHOICES,
        blank=False,
        db_column='contexto'
    )
    id_contexto = models.IntegerField(null=True, blank=True, db_column='id_contexto')
    duracion_ms = models.IntegerField(null=True, blank=True, db_column='duracion_ms')

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

    id_error = models.AutoField(primary_key=True, db_column='id_error')
    id_sesion = models.ForeignKey(
        SesionPractica,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='errores',
        db_column='id_sesion'
    )
    id_usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='errores',
        db_column='id_usuario'
    )
    id_seña_esperada = models.ForeignKey(
        DiccionarioSeña,
        on_delete=models.CASCADE,
        related_name='errores_esperada',
        db_column='id_seña_esperada'
    )
    id_seña_detectada = models.ForeignKey(
        DiccionarioSeña,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='errores_detectada',
        db_column='id_seña_detectada'
    )
    tipo_error = models.CharField(
        max_length=50,
        choices=TIPO_ERROR_CHOICES,
        db_column='tipo_error'
    )
    descripcion_error = models.TextField(null=True, blank=True, db_column='descripcion_error')
    confianza_deteccion = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        db_column='confianza_deteccion'
    )
    timestamp = models.DateTimeField(auto_now_add=True, db_column='timestamp')
    retroalimentacion_mostrada = models.BooleanField(default=False, db_column='retroalimentacion_mostrada')

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
