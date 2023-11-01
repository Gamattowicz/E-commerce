import django_filters

from .models import Product


class ProductFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr="icontains")
    category = django_filters.CharFilter(
        field_name="category__name", lookup_expr="icontains"
    )
    description = django_filters.CharFilter(lookup_expr="icontains")
    price = django_filters.NumberFilter()

    class Meta:
        model = Product
        fields = ["name", "category", "description", "price"]
