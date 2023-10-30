from rest_framework import serializers

from categories.models import Category

from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name")
    image = serializers.ImageField(max_length=None, use_url=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "price",
            "category",
            "image",
            "thumbnail",
        ]
        read_only_fields = ["thumbnail"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        request = self.context.get("request")
        if request and (request.method in ["POST", "PUT"]):
            representation.pop("thumbnail", None)

        return representation

    def create(self, validated_data):
        category_name = validated_data.pop("category")["name"]
        category, _ = Category.objects.get_or_create(name=category_name)
        product = Product.objects.create(category=category, **validated_data)
        return product
