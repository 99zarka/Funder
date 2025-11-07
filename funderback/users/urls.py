from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserRegisterView, UserLoginView, UserActivateView, UserProfileView

urlpatterns = [
    path("register/", UserRegisterView.as_view(), name="register"),
    path("profile/", UserProfileView.as_view(), name="profile"), # Add this line
    path("login/", UserLoginView.as_view(), name="login"),
    path("activate/", UserActivateView.as_view(), name="activate"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
