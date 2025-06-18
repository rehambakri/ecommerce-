from django.urls import path 
from . import views

urlpatterns=[
    path('products', views.products,name="products"),
    path('product/<int:product_id>/', views.product, name="product"),
    path('categories',views.categories,name="categories" ),
    path('category/<int:category_id>/', views.selectedCategory, name='category'),
    path('category/create/', views.create_category, name='create_category'),
    path('category/<int:category_id>/edit/', views.edit_category, name='edit_category'),
    path('category/<int:category_id>/delete/', views.delete_category, name='delete_category'),

]