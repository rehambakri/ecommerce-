from django.urls import path 
from . import views

#(url name to access , views.functionName , name='index' )
urlpatterns = [
    path('',views.index , name='index'),
    path('contact',views.contact ,name="contact"),
    path('about',views.about ,name="about"),

]