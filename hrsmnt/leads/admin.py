from django.contrib import admin
from .models import *


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    readonly_fields = ('password',)


class ItemImageInline(admin.TabularInline):
    model = ItemImage


class CounterItemInline(admin.TabularInline):
    model = Counter
    readonly_fields = ('status',)


class ItemGridParameterInline(admin.TabularInline):
    model = ItemGridParameter


class ItemGridValueInline(admin.TabularInline):
    model = ItemGridValue

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "size":
            kwargs["queryset"] = Counter.objects.filter(
                item=ItemGridParameter.objects.get(pk=request.path.split('/')[4]).item)
        return super(ItemGridValueInline, self).formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(ItemGridParameter)
class ItemGridParameterAdmin(admin.ModelAdmin):
    readonly_fields = ('item',)
    inlines = [ItemGridValueInline]


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    inlines = [ItemImageInline, CounterItemInline, ItemGridParameterInline]


@admin.register(Type)
class TypeAdmin(admin.ModelAdmin):
    pass


class ItemOrderInline(admin.TabularInline):
    model = OrderItem
    readonly_fields = ('item', 'size', 'price')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    readonly_fields = ('user', 'delivery_type', 'tel', 'email', 'first_name', 'second_name',
                       'patronymic', 'address', 'postal_code', 'pay_way', 'pay_notified', 'payment_id', 'total_price',
                       'promo')
    inlines = [ItemOrderInline]


@admin.register(Promo)
class PromoAdmin(admin.ModelAdmin):
    pass
