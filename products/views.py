from django.shortcuts import render , get_object_or_404,redirect
from .models import Product , Category
from django.core.paginator import Paginator
from products.forms import CategoryForm
from django.contrib.admin.views.decorators import staff_member_required

# Create your views here.


def products(request):
    products = Product.objects.all()
    return render(request, 'product/products.html', {'products': products})

def product(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    return render(request, 'product/product.html', {'product': product})

def categories(request):
    categories = Category.objects.all()
    paginator = Paginator(categories,3 )  
    page_number = request.GET.get('page')  
    page_obj = paginator.get_page(page_number) 
    return render(request,'categories/categories.html',{
        'categories':categories,
        'page_obj': page_obj,

        })


def selectedCategory(request,category_id):
    category = get_object_or_404(Category, id=category_id)
    products = category.product.all()
    paginator = Paginator(products,3 )  
    page_number = request.GET.get('page')  
    page_obj = paginator.get_page(page_number)  
    return render(request, 'categories/category.html', {
        'category': category,
        'page_obj': page_obj,
        'products': products
    })



@staff_member_required
def create_category(request):
    if request.method == 'POST':
        form = CategoryForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('categories')
    else:
        form = CategoryForm()
    return render(request, 'categories/category_form.html', {'form': form, 'title': 'Create Category'})

@staff_member_required
def edit_category(request, category_id):
    category = get_object_or_404(Category, pk=category_id)
    if request.method == 'POST':
        form = CategoryForm(request.POST, request.FILES, instance=category)
        if form.is_valid():
            form.save()
            return redirect('categories')
    else:
        form = CategoryForm(instance=category)
    return render(request, 'categories/category_form.html', {'form': form, 'title': 'Edit Category'})

@staff_member_required
def delete_category(request, category_id):
    category = get_object_or_404(Category, pk=category_id)
    if request.method == 'POST':
        category.delete()
        return redirect('categories')
    return render(request, 'categories/delete_confirm.html', {'category': category})