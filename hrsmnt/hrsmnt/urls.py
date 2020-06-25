from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('frontend.urls')),
    path('', include('leads.urls')),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/regisrtration', include('rest_auth.registration.urls'))
]
