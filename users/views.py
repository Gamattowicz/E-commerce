from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import CustomUserSerializer, MyTokenObtainPairSerializer


class CreateCustomUserView(generics.CreateAPIView):
    serializer_class = CustomUserSerializer


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
