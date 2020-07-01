from rest_framework.decorators import api_view, parser_classes
from django.http import HttpResponse
from django.core.serializers import deserialize
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .ya_kassa import pay as ya_pay
from rest_framework.response import Response
from django.core import exceptions
from rest_framework import status
from django.contrib.auth.decorators import login_required
from django.db.utils import IntegrityError
from django.db.models import Q
from django.core.mail import send_mail, mail_admins
import jwt
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import random
import json
from cent import Client
from .serializers import *


@api_view(['GET'])
@login_required
def user_data(request):
    user = request.user
    return Response(UserDataSerializer(user).data)


@api_view(['POST'])
@login_required
def change_settings(request):
    serializer = ChangeUserDataSerializer(request.user, request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def ok(request):
    return Response()


@api_view(['POST'])
@login_required
def save_address(request):
    request.data['owner'] = request.user.id
    serializer = AddressSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'id': serializer.instance.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@login_required
def get_addresses(request):
    addresses = request.user.addresses.all()
    serializer = AddressSerializer(addresses, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@login_required
def update_address(request):
    request.data['owner'] = request.user.id
    if request.data['apartment'] == '':
        request.data['apartment'] = None
    serializer = AddressSerializer(Address.objects.get(pk=request.data['id']), request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_200_OK)
    print(serializer.errors)
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@login_required
def delete_address(request):
    address = Address.objects.get(pk=request.data['id'])
    address.delete()
    return Response(status=status.HTTP_200_OK)


@api_view(['GET'])
def get_items(request):
    if request.user.is_staff:
        serializer = SimpleItemSerializer(Item.objects.all(), many=True)
    else:
        serializer = SimpleItemSerializer(Item.objects.filter(active=True), many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_item(request):
    try:
        item = Item.objects.get(pk=request.GET['id'])
        if item.active or request.user.is_staff:
            if not request.user.is_staff:
                item.views_count += 1
                item.save()
            serializer = VerboseItemSerializer(item)
            data = serializer.data
            if not request.user.is_anonymous:
                data['is_favorite'] = True if request.user.favorites.filter(item_id=request.GET['id']) else False
            return Response(data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    except exceptions.ObjectDoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@login_required
def get_favorites(request):
    favorites = request.user.favorites.all()
    try:
        serializer = SimpleItemSerializer([favorite.item for favorite in favorites], many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except exceptions.ObjectDoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@login_required
def add_favorite(request):
    try:
        favorite = Favorite(user=request.user, item_id=request.data['id'])
        try:
            favorite.save()
        except IntegrityError:
            Favorite.objects.get(item_id=request.data['id']).delete()
            return Response(status=status.HTTP_202_ACCEPTED)
        return Response(status=status.HTTP_200_OK)
    except KeyError:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def suggestion(request):
    max_len = 4
    items = Item.objects.filter(Q(type__title=request.GET['type']) & ~Q(id=request.GET['id']) & Q(active=True))[
            :max_len]
    if not items:
        items = list(Item.objects.filter(~Q(id=request.GET['id']) & Q(active=True)))
        if len(items) < max_len:
            max_len = len(items)
        items = random.sample(items, max_len)
    serializer = SimpleItemSerializer(items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def pay(request):
    items = request.data['items']
    error_items = []
    good_items = []
    for item in items:
        size = Counter.objects.get(Q(item_id=item['id']) & Q(title=item['size']))
        if size.amount - size.reserved > 0:
            good_items.append({"id": item['id'], "size": size})
        else:
            error_items.append(item['id'])
    if error_items:
        return Response(error_items, status.HTTP_400_BAD_REQUEST)
    order = Order()
    if not request.user.is_anonymous:
        order.user = request.user

    order.email = request.data['email']
    order.tel = request.data['tel']

    metro = 'У метро Киевская'
    courier = 'Курьером'
    post = 'Почтой России'
    delivery_type = post
    if request.data['delivery_type'] == 'post':
        order.delivery_type = 'p'
        order.first_name = request.data['first_name']
        order.second_name = request.data['second_name']
        order.patronymic = request.data['patronymic']
        order.postal_code = request.data['postal_code']
        order.address = request.data['address']
    if request.data['delivery_type'] == 'courier':
        delivery_type = courier
        order.delivery_type = 'c'
        order.address = request.data['address']
    if request.data['delivery_type'] == 'metro':
        delivery_type = metro
        order.delivery_type = 'm'
    order.pay_way = request.data['pay_way']
    order.save()

    order_items = [OrderItem(item_id=item['id'], size=item['size'], order=order) for item in good_items]
    for item in order_items:
        item.save()
    price = 0

    # DELIVERY AND TOTAL PRICE
    sng = ['Азербайджан', 'Армения', 'Белоруссия', 'Казахстан', 'Киргизия', 'Молдавия', 'Таджикистан', 'Узбекистан']
    if request.data['city'] != 'Москва':
        if request.data['country'] == 'Россия':
            price += 350
        elif request.data['country'] in sng:
            price += 650

    for item in order_items:
        price += item.item.price
    order.total_price = price
    order.save()
    pay_way = "Наличными" if order.pay_way == 'cash' else "Безналичными"

    subject = f'[HRSMNT] Заказ №{order.id}'
    html_message = render_to_string('emails/order.html',
                                    {'items': order_items, 'delivery_type': delivery_type, 'order': order,
                                     'metro': metro, 'post': post, 'pay_way': pay_way})
    plain_message = strip_tags(html_message)
    from_email = 'hrsmnt@hrsmnt.ru'
    if order.pay_way == 'cash':
        send_mail(subject, plain_message, from_email, [order.email], html_message=html_message)
        # + ['hrsmnt@hrsmnt.ru']
        return Response({"order_id": order.id}, status.HTTP_200_OK)
    token = ya_pay(price, order.id)
    return Response({"order_id": order.id,
                     "token": token,
                     "cent_token": jwt.encode({"sub": f"{order.id}"}, settings.CENTRIFUGO_SECRET).decode()
                     }, status=status.HTTP_200_OK)


@csrf_exempt
def pay_notify(request):
    data = json.loads(request.body)
    cl = Client(settings.CENTRIFUGO_HOST, api_key=settings.CENTRIFUGO_API_KEY, timeout=1)
    cl.publish(f'payment{int(data["description"].split("№")[1])}', {'status': data['object']['status']})
    response = HttpResponse()
    response.status_code = 200
    return response
