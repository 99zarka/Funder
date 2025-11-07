from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserRegisterView, UserLoginView, UserActivateView, UserProfileView, UserListView

urlpatterns = [
    path("register/", UserRegisterView.as_view(), name="register"),
    path("profile/", UserProfileView.as_view(), name="profile"),
    path("profile/<int:pk>/", UserProfileView.as_view(), name="user-profile-detail"), # New URL for fetching other user profiles
    path("login/", UserLoginView.as_view(), name="login"),
    path("activate/", UserActivateView.as_view(), name="activate"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("all/", UserListView.as_view(), name="all-users"), # New URL for listing all users
]
