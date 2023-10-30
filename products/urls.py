from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import MostOrderedProductsView, ProductViewSet

router = DefaultRouter()
router.register("", ProductViewSet, basename="product")

urlpatterns = [
    path("top/", MostOrderedProductsView.as_view(), name="top_product"),
    path("", include(router.urls)),
]
