from django.db import models

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    image = models.ImageField(upload_to='photos/%y/%m/%d', default=False)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    image = models.ImageField(upload_to='photos/%y/%m/%d')
    content =  models.TextField(default='null')
    description = models.TextField(default='null')
    category = models.ManyToManyField(Category , related_name="product")

    def __str__(self):
        return self.name 
