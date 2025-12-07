from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from django.contrib.auth import update_session_auth_hash

from .models import Usuario
from .serializers import (
    UsuarioSerializer,
    RegisterSerializer,
    LoginSerializer,
    ChangePasswordSerializer,
    UpdateProfileSerializer
)


class RegisterView(generics.CreateAPIView):
    """Vista para registro de nuevos usuarios"""
    
    queryset = Usuario.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generar tokens JWT
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'success': True,
            'message': 'Usuario registrado exitosamente',
            'data': {
                'user': UsuarioSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """Vista para login de usuarios"""
    
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer
    
    def post(self, request):
        serializer = self.serializer_class(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        # Actualizar último acceso
        user.ultimo_acceso = timezone.now()
        user.save(update_fields=['ultimo_acceso'])
        
        # Generar tokens JWT
        refresh = RefreshToken.for_user(user)
        
        # CAMBIO: Determinar redirección según is_staff con URLs completas
        if user.is_staff:
            redirect_to = 'http://localhost:5175/dashboard'  # CAMBIO: Admin frontend
        else:
            redirect_to = 'http://localhost:5173/traducir'   # Usuario frontend
        
        return Response({
            'success': True,
            'message': 'Login exitoso',
            'data': {
                'user': UsuarioSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                'redirect_to': redirect_to
            }
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """Vista para logout de usuarios"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            return Response({
                'success': True,
                'message': 'Logout exitoso'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Error al cerrar sesión',
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveAPIView):
    """Vista para obtener perfil del usuario autenticado"""
    
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class UpdateProfileView(generics.UpdateAPIView):
    """Vista para actualizar perfil del usuario"""
    
    serializer_class = UpdateProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response({
            'success': True,
            'message': 'Perfil actualizado exitosamente',
            'data': UsuarioSerializer(instance).data
        })


class ChangePasswordView(APIView):
    """Vista para cambiar contraseña"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        # Mantener la sesión activa después del cambio
        update_session_auth_hash(request, user)
        
        return Response({
            'success': True,
            'message': 'Contraseña cambiada exitosamente'
        }, status=status.HTTP_200_OK)


class VerifyTokenView(APIView):
    """Vista para verificar si un token es válido"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        return Response({
            'success': True,
            'message': 'Token válido',
            'data': {
                'user': UsuarioSerializer(request.user).data
            }
        }, status=status.HTTP_200_OK)


class DeleteAccountView(APIView):
    """Vista para eliminar (soft delete) cuenta de usuario"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request):
        user = request.user
        user.eliminado = True
        user.activo = False
        user.fecha_eliminacion = timezone.now()
        user.save()
        
        return Response({
            'success': True,
            'message': 'Cuenta eliminada exitosamente'
        }, status=status.HTTP_200_OK)