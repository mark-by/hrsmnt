from django.shortcuts import render
from rest_auth import views


class LoginView(views.LoginView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            response.set_cookie('auth', 1, 1209600, 1209600)
        return response


class LogoutView(views.LogoutView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            response.delete_cookie('auth')
        return response
