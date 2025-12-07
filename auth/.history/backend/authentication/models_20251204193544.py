from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

class UsuarioManager(BaseUserManager):
    """Manager personalizado para el modelo Usuario"""
    
    def create_user(self, email, nombre, tipo_usuario, password=None, **extra_fields):
        """Crea y guarda un usuario regular"""
        if not email:
            raise ValueError('El usuario debe tener un email')
        if not nombre:
            raise ValueError('El usuario debe tener un nombre')
        if not tipo_usuario:
            raise ValueError('El usuario debe tener un tipo')
        
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            nombre=nombre,
            tipo_usuario=tipo_usuario,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, nombre, password=None, **extra_fields):
        """Crea y guarda un superusuario (administrador)"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        # Asegurar que tipo_usuario esté definido
        if 'tipo_usuario' not in extra_fields:
            extra_fields['tipo_usuario'] = 'oyente'
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser debe tener is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser debe tener is_superuser=True')
        
        return self.create_user(email, nombre, extra_fields['tipo_usuario'], password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    """Modelo personalizado de Usuario basado en la BD de SignSpeak"""
    
    TIPO_USUARIO_CHOICES = [
        ('oyente', 'Oyente'),
        ('sordo', 'Sordo'),
        ('mudo', 'Mudo'),
        ('sordomudo', 'Sordomudo'),
    ]
    
    # Campos del modelo
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    email = models.EmailField(max_length=150, unique=True)
    password = models.CharField('contraseña', max_length=255, db_column='contraseña')
    tipo_usuario = models.CharField(
        max_length=20,
        choices=TIPO_USUARIO_CHOICES
    )
    foto_perfil = models.TextField(blank=True, null=True)
    fecha_registro = models.DateTimeField(default=timezone.now)
    ultimo_acceso = models.DateTimeField(blank=True, null=True)
    activo = models.BooleanField(default=True)
    eliminado = models.BooleanField(default=False)
    fecha_eliminacion = models.DateTimeField(blank=True, null=True)
    
    # Campos necesarios para Django Admin
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    last_login = models.DateTimeField(blank=True, null=True)
    
    # Configuración del manager
    objects = UsuarioManager()
    
    # Configuración de autenticación
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre']
    
    class Meta:
        db_table = 'usuarios'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
    
    def __str__(self):
        return f"{self.nombre} ({self.email})"
    
    def save(self, *args, **kwargs):
        # El campo password (con db_column='contraseña') se sincroniza automáticamente
        super().save(*args, **kwargs)
    
    def get_full_name(self):
        return self.nombre
    
    def get_short_name(self):
        return self.nombre
    
    @property
    def es_administrador(self):
        """Verifica si el usuario es administrador"""
        return self.is_staff or self.is_superuser