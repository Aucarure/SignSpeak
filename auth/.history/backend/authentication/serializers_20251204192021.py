from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Usuario"""
    
    class Meta:
        model = Usuario
        fields = [
            'id_usuario',
            'nombre',
            'email',
            'tipo_usuario',
            'foto_perfil',
            'fecha_registro',
            'ultimo_acceso',
            'activo',
            'es_administrador'
        ]
        read_only_fields = ['id_usuario', 'fecha_registro', 'ultimo_acceso']


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer para registro de nuevos usuarios"""
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        min_length=6
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = Usuario
        fields = [
            'nombre',
            'email',
            'tipo_usuario',
            'password',
            'password_confirm'
        ]
    
    def validate(self, data):
        """Validar que las contraseñas coincidan"""
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Las contraseñas no coinciden'
            })
        return data
    
    def validate_email(self, value):
        """Validar que el email no esté registrado"""
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError('Este email ya está registrado')
        return value
    
    def create(self, validated_data):
        """Crear nuevo usuario"""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        user = Usuario.objects.create_user(
            password=password,
            **validated_data
        )
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer para login de usuarios"""
    
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, data):
        """Validar credenciales del usuario"""
        email = data.get('email')
        password = data.get('password')
        
        if email and password:
            # Autenticar usuario
            user = authenticate(
                request=self.context.get('request'),
                username=email,
                password=password
            )
            
            if not user:
                raise serializers.ValidationError(
                    'Credenciales incorrectas',
                    code='authorization'
                )
            
            if not user.activo:
                raise serializers.ValidationError(
                    'Esta cuenta está desactivada',
                    code='authorization'
                )
            
            if user.eliminado:
                raise serializers.ValidationError(
                    'Esta cuenta ha sido eliminada',
                    code='authorization'
                )
            
        else:
            raise serializers.ValidationError(
                'Debe incluir email y contraseña',
                code='authorization'
            )
        
        data['user'] = user
        return data


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer para cambio de contraseña"""
    
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, min_length=6)
    new_password_confirm = serializers.CharField(required=True, write_only=True)
    
    def validate(self, data):
        """Validar que las contraseñas nuevas coincidan"""
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': 'Las contraseñas no coinciden'
            })
        return data
    
    def validate_old_password(self, value):
        """Validar que la contraseña actual sea correcta"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Contraseña actual incorrecta')
        return value


class UpdateProfileSerializer(serializers.ModelSerializer):
    """Serializer para actualizar perfil de usuario"""
    
    class Meta:
        model = Usuario
        fields = ['nombre', 'tipo_usuario', 'foto_perfil']
    
    def validate_nombre(self, value):
        """Validar que el nombre no esté vacío"""
        if not value or value.strip() == '':
            raise serializers.ValidationError('El nombre no puede estar vacío')
        return value