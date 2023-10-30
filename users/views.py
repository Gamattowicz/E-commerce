from rest_framework import generics

from .serializers import CustomUserSerializer


class CreateCustomUserView(generics.CreateAPIView):
    serializer_class = CustomUserSerializer