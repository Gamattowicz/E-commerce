from datetime import datetime, timedelta

from django.db.models import Sum
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.filters import OrderingFilter
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from orders.models import Order, OrderItem
from users.permissions import IsSeller

from .filters import ProductFilter
from .models import Product
from .serializers import ProductSerializer
from .utils import ProductPagination


class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = ProductPagination
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filterset_class = ProductFilter
    ordering_fields = ["name", "-name", "category", "-category", "price", "-price"]
    permission_classes = [IsSeller]
    parser_classes = (MultiPartParser, FormParser)

    @swagger_auto_schema(
        operation_description="Retrieve a list of all products.",
        responses={200: ProductSerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Retrieve details of a specific product.",
        responses={200: ProductSerializer},
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Create a new product.",
        request_body=ProductSerializer,
        parser_classes=(MultiPartParser,),
        responses={201: ProductSerializer},
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Update product information.",
        request_body=ProductSerializer,
        responses={200: ProductSerializer},
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Delete a product.",
        responses={204: "Product successfully deleted"},
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsSeller]
        return [permission() for permission in permission_classes]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class MostOrderedProductsView(APIView):
    @swagger_auto_schema(
        operation_description="Get the most ordered products",
        manual_parameters=[
            openapi.Parameter(
                name="date_from",
                in_=openapi.IN_QUERY,
                description="Start date for filtering orders",
                type=openapi.TYPE_STRING,
                format="date",
            ),
            openapi.Parameter(
                name="date_to",
                in_=openapi.IN_QUERY,
                description="End date for filtering orders",
                type=openapi.TYPE_STRING,
                format="date",
            ),
            openapi.Parameter(
                name="product_count",
                in_=openapi.IN_QUERY,
                description="Number of top products to return",
                type=openapi.TYPE_INTEGER,
            ),
        ],
    )
    def get(self, request, *args, **kwargs):
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")
        product_count = int(request.query_params.get("product_count", 10))

        filtered_orders = Order.objects.all()
        if date_from:
            filtered_orders = filtered_orders.filter(order_date__gte=date_from)
        if date_to:
            date_to_obj = datetime.strptime(date_to, "%Y-%m-%d").date()
            next_day = date_to_obj + timedelta(days=1)
            filtered_orders = filtered_orders.filter(order_date__lte=next_day)

        top_products = (
            OrderItem.objects.filter(order__in=filtered_orders)
            .values("product__name", "product_id")
            .annotate(total_ordered=Sum("quantity"))
            .order_by("-total_ordered")[:product_count]
        )

        return Response(top_products)
