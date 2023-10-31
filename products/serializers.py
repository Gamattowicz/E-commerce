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
        read_only_fields = ["thumbnail", "id"]

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

    def update(self, instance, validated_data):
        print("Updating with data:", validated_data)
        category_name = validated_data.pop("category")["name"]
        category, _ = Category.objects.get_or_create(name=category_name)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.category = category
        instance.save()

        return instance

    def partial_update(self, instance, validated_data):
        print("Updating with data:", validated_data)
        category_name = validated_data.pop("category")["name"]
        category, _ = Category.objects.get_or_create(name=category_name)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.category = category
        instance.save()

        return instance
