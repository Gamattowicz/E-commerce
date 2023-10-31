from django.urls import path

from .views import CreateCustomUserView, MyTokenObtainPairView

# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path("register/", CreateCustomUserView.as_view(), name="register"),
    path("login/", MyTokenObtainPairView.as_view(), name="login"),
    # path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    # path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
