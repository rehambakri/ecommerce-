from django.shortcuts import render , get_object_or_404
from .models import Product

# Create your views here.


def products(request):
    products = Product.objects.all()
    return render(request, 'product/products.html', {'products': products})

def product(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    return render(request, 'product/product.html', {'product': product})

