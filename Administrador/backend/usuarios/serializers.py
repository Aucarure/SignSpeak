from rest_framework import serializers
from .models import Usuario, ConfiguracionUsuario
from django.contrib.auth.hashers import make_password


class ConfiguracionUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracionUsuario
        fields = [
            'id_configuracion',
            'tamaño_fuente',
            'tema',
            'velocidad_animaciones',
            'notificaciones_habilitadas',
            'sonido_habilitado',
            'vibracion_habilitada',
            'idioma',
            'fecha_actualizacion',
        ]

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'id_usuario',
            'nombre',
            'email',
            'tipo_usuario',
            'foto_perfil',
            'activo',
            'fecha_registro',
        ]
        read_only_fields = ['id_usuario', 'fecha_registro']




class UsuarioCreateUpdateSerializer(serializers.ModelSerializer):
    contraseña = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = Usuario
        fields = [
            'nombre',
            'email',
            'contraseña',
            'tipo_usuario',
            'foto_perfil',
            'activo',
        ]
        extra_kwargs = {
            'foto_perfil': {'required': False},
        }

    def create(self, validated_data):
        # Hash de la contraseña
        if 'contraseña' in validated_data and validated_data['contraseña']:
            validated_data['contraseña'] = make_password(validated_data['contraseña'])
        
        usuario = Usuario.objects.create(**validated_data)
        
        # Crear configuración por defecto
        ConfiguracionUsuario.objects.create(id_usuario=usuario)
        
        return usuario

    def update(self, instance, validated_data):
        # Si hay contraseña, hashearla
        if 'contraseña' in validated_data:
            if validated_data['contraseña']:
                validated_data['contraseña'] = make_password(validated_data['contraseña'])
            else:
                # Si está vacía, no actualizar
                validated_data.pop('contraseña')
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance


class UsuarioListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listados"""
    
    class Meta:
        model = Usuario
        fields = [
            'id_usuario',
            'nombre',
            'email',
            'tipo_usuario',
            'fecha_registro',
            'activo',
        ]