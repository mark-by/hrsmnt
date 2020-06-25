from django.db import models

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from datetime import datetime
import django.core.exceptions as exceptions
from .utils import *


class UserManager(BaseUserManager):
    def create_user(self, email, username, name, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        if not username:
            raise ValueError("Users must have an username")
        if not name:
            raise ValueError("Users must have an name")

        user = self.model(
            email=self.normalize_email(email),
            name=name,
            password=password,
            username=username,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, name, password):
        user = self.create_user(
            email=self.normalize_email(email),
            password=password,
            name=name,
            username=username
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    username = models.CharField(max_length=32, unique=True)
    name = models.CharField(max_length=32)
    email = models.EmailField(max_length=60, unique=True)
    date_joined = models.DateField(verbose_name="date joined", auto_now_add=True)
    last_login = models.DateTimeField(verbose_name="last login", auto_now=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    gender = models.CharField(max_length=1, choices=[('m', 'Male'),
                                                     ('f', 'Female'),
                                                     ('p', 'Prefer not to say')], default='p')
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email", "name"]

    objects = UserManager()

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True

    class Meta:
        ordering = ['-date_joined']
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"


class Type(models.Model):
    title = models.CharField(max_length=32)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-title']
        verbose_name = "Категория"
        verbose_name_plural = "Категории"


class ItemImage(models.Model):
    item = models.ForeignKey('Item', related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to=path_for_item_image, help_text='Размер изображения  330х500')

    def __str__(self):
        return f"item_image_{self.pk}"


class Counter(models.Model):
    title = models.CharField(max_length=32)
    amount = models.PositiveIntegerField(default=0)
    item = models.ForeignKey('Item', related_name='counters', on_delete=models.CASCADE)

    @property
    def is_available(self):
        return self.amount > 0

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Размер'
        verbose_name_plural = 'Размеры'


class Item(models.Model):
    title = models.CharField(max_length=32)
    type = models.ForeignKey(Type, on_delete=models.CASCADE, related_name='items')
    price = models.IntegerField()
    description = models.TextField(blank=True, null=True, default=None)
    create_at = models.DateTimeField(auto_now_add=True)
    front_image = models.ImageField(upload_to=path_for_item_main_image,
                                    help_text='Фото вещи спереди. Размер изображения 250х290')
    back_image = models.ImageField(upload_to=path_for_item_back_image,
                                   help_text='Фото вещи сзади. Размер изображения 250х290')
    active = models.BooleanField(default=False)
    views_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-create_at']
        verbose_name = "Вещь"
        verbose_name_plural = "Вещи"


class ItemGridParameter(models.Model):
    item = models.ForeignKey(Item, related_name="parameters", on_delete=models.CASCADE)
    title = models.CharField(max_length=32)

    def __str__(self):
        return f"{self.item.title}: {self.title}"

    class Meta:
        verbose_name = "Параметр размерной сетки"
        verbose_name_plural = "Параметры размерной сетки"


class ItemGridValue(models.Model):
    size = models.ForeignKey(Counter, related_name="size", on_delete=models.CASCADE)
    parameter = models.ForeignKey(ItemGridParameter, related_name="values", on_delete=models.CASCADE)
    value = models.PositiveIntegerField()
    priority = models.PositiveSmallIntegerField(default=0)

    class Meta:
        verbose_name = "Значение параметра размерной сетки"
        verbose_name_plural = "Значения параметра размерной сетки"
        ordering=['priority']


class Address(models.Model):
    title = models.CharField(max_length=32)
    value = models.TextField()
    postal_code = models.IntegerField()
    apartment = models.SmallIntegerField(blank=True, null=True)
    owner = models.ForeignKey(User, related_name='addresses', on_delete=models.CASCADE)

    class Meta:
        ordering = ['title']


class Favorite(models.Model):
    item = models.ForeignKey(Item, related_name='followers', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='favorites', on_delete=models.CASCADE)
    create_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-create_at']
        unique_together = ('item', 'user')


class OrderItem(models.Model):
    item = models.OneToOneField(Item, on_delete=models.DO_NOTHING)
    size = models.OneToOneField(Counter, on_delete=models.DO_NOTHING)


class Order(models.Model):
    item = models.ForeignKey(OrderItem, related_name='orders', on_delete=models.DO_NOTHING)
    user = models.ForeignKey(User, related_name='orders', on_delete=models.DO_NOTHING, blank=True, null=True,
                             default=None)
    user_name = models.CharField(max_length=32, blank=True, null=True, default=None)
    user_email = models.EmailField(blank=True, null=True, default=None)
    user_address = models.TextField(blank=True, null=True, default=None)
    create_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-create_at']
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
