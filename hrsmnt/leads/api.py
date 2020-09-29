from rest_framework.decorators import api_view, parser_classes
from django.http import HttpResponse
from .ya_kassa import pay as ya_pay
from rest_framework.response import Response
from django.core import exceptions
from rest_framework import status
from django.contrib.auth.decorators import login_required
from django.db.utils import IntegrityError
from django.db.models import Q
from .promocode import *
from rest_framework.generics import CreateAPIView
import jwt
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import random
import json
from cent import Client
from .serializers import *
import threading


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


class Pay(CreateAPIView):
    order = None
    order_items = []

    def filter_items(self):
        items = self.request.data['items']
        error_items = []
        good_items = []
        for item in items:
            size = Counter.objects.get(Q(item_id=item['id']) & Q(title=item['size']))
            if size.amount - size.reserved > 0:
                good_items.append({"id": item['id'], "size": size})
            else:
                error_items.append({"id": item['id'], "size": size.title})
        return error_items, good_items

    def set_order_data(self):
        if not self.request.user.is_anonymous:
            self.order.user = self.request.user

        self.order.email = self.request.data['email']
        self.order.tel = self.request.data['tel']

        if self.request.data['delivery_type'] == 'post':
            self.order.delivery_type = 'p'
            self.order.first_name = self.request.data['first_name']
            self.order.second_name = self.request.data['second_name']
            self.order.patronymic = self.request.data['patronymic']
            self.order.postal_code = self.request.data['postal_code']
            self.order.address = self.request.data['address']
        elif self.request.data['delivery_type'] == 'courier':
            self.order.delivery_type = 'c'
            self.order.address = self.request.data['address']
        elif self.request.data['delivery_type'] == 'metro':
            self.order.delivery_type = 'm'
        self.order.pay_way = self.request.data['pay_way']
        self.order.save()

    def set_order_items(self, good_items):
        self.order_items = [OrderItem(item_id=item['id'], size=item['size'], order=self.order) for item in good_items]
        for item in self.order_items:
            item.save()

    def delivery_price(self):
        delivery_type = self.request.data['delivery_type']
        try:
            country = self.request.data['country']
        except KeyError:
            country = "Россия"
        return check_delivery_price(delivery_type, country)

    def process_promocode(self, delivery_price):
        promo, ok = check_promocode(self.request)
        if ok:
            bag_discount = process_bag_promocode(self.order.total_price, self.request.user, promo, self.order_items, False)
            delivery_price = process_delivery_promocode(delivery_price, self.request.user, promo, False)
            self.order.promo = promo
            return bag_discount, delivery_price
        else:
            return 0, delivery_price

    def set_total_price(self, delivery_price):
        price = 0
        for item in self.order_items:
            price += item.item.price
        self.order.total_price = price
        discount, delivery_price = self.process_promocode(delivery_price)
        self.order.total_price -= discount
        self.order.total_price += delivery_price
        self.order.save()

    def post(self, request, *args, **kwargs):
        self.order = Order()
        error_items, good_items = self.filter_items()
        if error_items:
            return Response(error_items, status.HTTP_400_BAD_REQUEST)
        self.set_order_data()
        self.set_order_items(good_items)
        delivery_price = self.delivery_price()
        self.set_total_price(delivery_price)
        options = {"subject": f'[HRSMNT] Заказ №{self.order.id}',
                   "template": 'emails/order.html',
                   "context": {'items': self.order_items, 'order': self.order},
                   "to": [self.order.email]}
        send_email = threading.Thread(target=send_template_email, kwargs=options)
        send_email.start()

        if self.order.pay_way == 'cash':
            return Response({"order_id": self.order.id}, status.HTTP_200_OK)
        ya_token, payment_id = ya_pay(self.order.total_price, self.order.id, self.order.email, self.order_items,
                                      delivery_price)
        self.order.payment_id = payment_id
        self.order.save()
        return Response({"order_id": self.order.id,
                         "token": ya_token,
                         "cent_token": jwt.encode({"sub": f"{self.order.id}"}, settings.CENTRIFUGO_SECRET).decode()
                         }, status=status.HTTP_200_OK)


@csrf_exempt
def pay_notify(request):
    data = json.loads(request.body)
    cl = Client(settings.CENTRIFUGO_HOST, api_key=settings.CENTRIFUGO_API_KEY,
                timeout=1)
    status = data['event']
    if status == 'refund.succeeded':
        return Response(status.HTTP_200_OK)
    order_id = int(data["object"]["description"].split("№")[1])
    cl.publish(f'payment{order_id}', status)
    try:
        order = Order.objects.get(pk=order_id)
    except exceptions.ObjectDoesNotExist:
        return Response(status.HTTP_200_OK)
    if status == 'payment.succeeded':
        order.pay_notified = True
        order.paid = True
        send_template_email(subject=f'[HRSMNT] Заказ №{order_id}',
                            template='emails/paid.html',
                            context={'order_id': order_id},
                            to=[order.email])
    elif status == 'payment.canceled':
        order.pay_notified = True
    order.save()
    response = HttpResponse()
    response.status_code = 200
    return response


@api_view(['GET'])
def check_payment(request):
    order = Order.objects.get(pk=request.GET['id'])
    return Response({"notified": order.pay_notified, "status": order.paid})


@api_view(['GET'])
def pay_order(request):
    try:
        order = Order.objects.get(pk=request.GET['id'])
        if order.paid:
            return Response({"error": "Заказ уже оплачен"}, status.HTTP_400_BAD_REQUEST)
        price = 0
        order_items = order.items.all()
        for item in order_items:
            price += item.item.price
        delivery_price = price - order.total_price
        ya_token, ya_id = ya_pay(order.total_price, order.id, order.email, order_items, delivery_price)
        return Response({"email": order.email,
                         "token": ya_token,
                         "cent_token": jwt.encode({"sub": f"{order.id}"}, settings.CENTRIFUGO_SECRET).decode()
                         }, status=status.HTTP_200_OK)
    except exceptions.ObjectDoesNotExist:
        return Response({"error": "Такого заказа не существует"}, status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@login_required
def get_orders(request):
    orders = Order.objects.filter(email=request.user.email)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data, status.HTTP_200_OK)

def check_promocode(request):
    """
    :param request: Http request
    :return: promo, ok

    If ok is False promo - error string
    """
    try:
        code = request.data['promocode']
        if code:
            code = code.strip()
        else:
            return "", False
        promo = Promo.objects.get(code__iexact=code)
    except (exceptions.ObjectDoesNotExist, KeyError):
        return "Такого промокода не существует", False
    if not promo.active:
        return "Промокод уже не действителен", False
    return verbose_check_promocode(request, promo)


@api_view(['POST'])
def activate_promocode(request):
    promo, ok = check_promocode(request)
    if ok:
        return Response({"title": promo.title, "description": promo.description})
    else:
        return Response({"error": promo}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def check_delivery_cost(request):
    try:
        delivery_type = request.data['delivery_type']
    except KeyError:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    try:
        delivery_country = request.data['country']
    except KeyError:
        delivery_country = 'Россия'
    delivery_price = check_delivery_price(delivery_type, delivery_country)
    promo, ok = check_promocode(request)
    if ok:
        delivery_price = process_delivery_promocode(delivery_price, request.user, promo)
    return Response({"delivery_price": delivery_price})


@api_view(["POST"])
def check_bag_cost(request):
    item_ids = request.data['items']
    items = Item.objects.filter(id__in=item_ids)
    promo, ok = check_promocode(request)
    total_price = 0
    for item in items:
        total_price += item.price * item_ids.count(item.id)
    if ok:
        total_price -= process_bag_promocode(total_price, request.user, promo, items)
    return Response({"price": total_price})
