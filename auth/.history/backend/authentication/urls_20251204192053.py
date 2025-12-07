from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    UserProfileView,
    UpdateProfileView,
    ChangePasswordView,
    VerifyTokenView,
    DeleteAccountView
)

app_name = 'authentication'

urlpatterns = [
    # Autenticación básica
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # JWT Token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', VerifyTokenView.as_view(), name='token_verify'),
    
    # Perfil de usuario
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('profile/update/', UpdateProfileView.as_view(), name='update_profile'),
    path('profile/change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('profile/delete/', DeleteAccountView.as_view(), name='delete_account'),
]