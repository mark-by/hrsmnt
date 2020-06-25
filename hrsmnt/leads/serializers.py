from rest_framework import serializers
from .models import *
from django.contrib.auth.forms import PasswordResetForm
from rest_auth.serializers import PasswordResetSerializer as REST_AUTH_PasswordResetSerializer


class PasswordResetSerializer(REST_AUTH_PasswordResetSerializer):
    email = serializers.EmailField()
    password_reset_form_class = PasswordResetForm

    def get_email_options(self):
        """Override this method to change default e-mail options"""
        return {'email_template_name': 'password_reset_email.txt'}


class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'name', 'gender')


class ChangeUserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'name', 'gender')


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ('id', 'title', 'value', 'postal_code', 'apartment', 'owner')


class CounterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Counter
        fields = ('title', 'is_available')


class ItemImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemImage
        fields = ('image',)


class ItemGridValueSerializer(serializers.ModelSerializer):
    size = serializers.StringRelatedField()

    class Meta:
        model = ItemGridValue
        fields = ('size', 'value')


class ItemGridParameterSerializer(serializers.ModelSerializer):
    values = ItemGridValueSerializer(many=True)

    class Meta:
        model = ItemGridParameter
        fields = ('title', 'values')


class SimpleItemSerializer(serializers.ModelSerializer):
    counters = CounterSerializer(many=True)

    class Meta:
        model = Item
        fields = ('id', 'title', 'price', 'back_image', 'front_image', 'counters')


class VerboseItemSerializer(serializers.ModelSerializer):
    counters = CounterSerializer(many=True)
    images = ItemImageSerializer(many=True)
    type = serializers.StringRelatedField()
    parameters = ItemGridParameterSerializer(many=True)

    class Meta:
        model = Item
        fields = ('id', 'title', 'price', 'back_image', 'front_image',
                  'counters', 'images', 'description', 'type', 'parameters')
