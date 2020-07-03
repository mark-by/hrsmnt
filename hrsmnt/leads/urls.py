from rest_framework import routers
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings as django_settings
from .api import *
from .views import *
from rest_auth.registration.views import RegisterView, VerifyEmailView
from rest_auth.views import PasswordChangeView, PasswordResetView, PasswordResetConfirmView

router = routers.DefaultRouter()

urlpatterns = router.get_urls() + [
    path('api/login', LoginView.as_view()),
    path('api/logout', LogoutView.as_view()),
    path('api/register', RegisterView.as_view()),
    path('api/verify-email', VerifyEmailView.as_view()),

    path('api/user_data', user_data),
    path('api/settings', change_settings),
    path('api/change-password', PasswordChangeView.as_view()),
    path('api/reset-password', PasswordResetView.as_view()),
    path('api/confirm-password', PasswordResetConfirmView.as_view()),

    path('api/get-items', get_items),
    path('api/get-item', get_item),

    path('api/get-favorites', get_favorites),
    path('api/add-favorite', add_favorite),
    path('api/get-suggestions', suggestion),

    path('api/create_pay', Pay.as_view()),

    path('pay_notify', pay_notify),
    path('api/check-payment', check_payment),
    path('api/pay-order', pay_order),
    path('api/order-history', get_orders),

    path('api/ok', ok, name='account_email_verification_sent'),
] + static(django_settings.MEDIA_URL, document_root=django_settings.MEDIA_ROOT)
