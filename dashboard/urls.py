from django.urls import path
from . import views

urlpatterns = [
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin-dashboard/create/', views.create_product, name='create_product'),
    path('admin-dashboard/edit/<int:product_id>/', views.edit_product, name='edit_product'),
    path('admin-dashboard/delete/<int:product_id>/', views.delete_product, name='delete_product'),
]
