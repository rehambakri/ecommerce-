from django.shortcuts import render
from products.models import Product

# Create your views here.

def index(request):
    all_products = Product.objects.all()
    top_3 = Product.objects.order_by('-price')[:3]
    return render(request, 'Home/index.html', {
        'products': all_products,
        'top_products': top_3,
    })
def contact(request):
    return render(request, 'Home/contact.html',{})

def about(request):
    return render(request, 'Home/about.html',{})
