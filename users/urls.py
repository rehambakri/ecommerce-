from django.urls import path , include
from django.contrib.auth import views as auth_views
from . import views
from .views import CustomLogoutView
from users import views as user_views

urlpatterns = [
    path('register',views.register,name="register"),
    path('login/', auth_views.LoginView.as_view(template_name='user/login.html'), name='login'),
    path('profile',user_views.profile, name='profile'),
    path('logout/', CustomLogoutView.as_view(), name='logout'),
    # search for why this logout is not accessing by /logout url 
    

]
