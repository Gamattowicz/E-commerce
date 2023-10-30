import os
from io import BytesIO

from django.core.files.base import ContentFile
from django.db import models
from PIL import Image

from categories.models import Category


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="products"
    )
    image = models.ImageField(upload_to="")
    thumbnail = models.ImageField(upload_to="thumbnails/", null=True, blank=True)

    def save(self, *args, **kwargs):
        creating = self._state.adding

        if self.image and not self.thumbnail:
            try:
                img = Image.open(self.image)

                if img.height > 200 or img.width > 200:
                    output_size = (200, 200)
                    img.thumbnail(output_size)

                    thumb_io = BytesIO()
                    img_format = "JPEG" if img.format == "JPEG" else "PNG"
                    img.save(thumb_io, format=img_format)

                    thumb_file_name = f"thumb_{os.path.basename(self.image.name)}"
                    thumb_file_path = thumb_file_name

                    if self.thumbnail:
                        storage.delete(self.thumbnail.path)

                    self.thumbnail.save(
                        thumb_file_path, ContentFile(thumb_io.getvalue()), save=False
                    )

            except Exception as e:
                print(f"An exception occurred while creating a thumbnail: {e}")

        if creating:
            super(Product, self).save(*args, **kwargs)
        else:
            super(Product, self).save(update_fields=["thumbnail"])

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
