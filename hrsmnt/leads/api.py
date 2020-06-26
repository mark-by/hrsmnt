from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from django.core import exceptions
from rest_framework import status
from django.contrib.auth.decorators import login_required
from django.db.utils import IntegrityError
from django.db.models import Q
import random
from .serializers import *


@api_view(['GET'])
@login_required
def user_data(request):
    user = request.user
    return Response(UserDataSerializer(user).data)


@api_view(['POST'])
@login_required
def settings(request):
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
    serializer = SimpleItemSerializer(Item.objects.filter(active=True), many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_item(request):
    try:
        item = Item.objects.get(pk=request.GET['id'])
        if item.active:
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
    items = Item.objects.filter(Q(type__title=request.GET['type']) & ~Q(id=request.GET['id']) & Q(active=True))[:max_len]
    if not items:
        items = list(Item.objects.filter(~Q(id=request.GET['id']) & Q(active=True)))
        if len(items) < max_len:
            max_len = len(items)
        items = random.sample(items, max_len)
    serializer = SimpleItemSerializer(items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
