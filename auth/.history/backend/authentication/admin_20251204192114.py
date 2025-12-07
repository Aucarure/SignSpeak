from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(BaseUserAdmin):
    """Configuración del admin para el modelo Usuario"""
    
    list_display = [
        'email',
        'nombre',
        'tipo_usuario',
        'activo',
        'is_staff',
        'fecha_registro',
        'ultimo_acceso'
    ]
    
    list_filter = [
        'tipo_usuario',
        'activo',
        'eliminado',
        'is_staff',
        'is_superuser',
        'fecha_registro'
    ]
    
    search_fields = ['email', 'nombre']
    
    ordering = ['-fecha_registro']
    
    fieldsets = (
        ('Información Personal', {
            'fields': ('email', 'nombre', 'tipo_usuario', 'foto_perfil')
        }),
        ('Permisos', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Estado de Cuenta', {
            'fields': ('activo', 'eliminado', 'fecha_eliminacion')
        }),
        ('Fechas Importantes', {
            'fields': ('fecha_registro', 'ultimo_acceso', 'last_login')
        }),
    )
    
    add_fieldsets = (
        ('Crear Usuario', {
            'classes': ('wide',),
            'fields': ('email', 'nombre', 'tipo_usuario', 'password1', 'password2'),
        }),
    )
    
    readonly_fields = ['fecha_registro', 'ultimo_acceso', 'last_login']
    
    filter_horizontal = ('groups', 'user_permissions',)