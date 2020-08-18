from rest_framework import status
from rest_framework.response import Response


def verbose_check_promocode(request, promo):
    """
    :param request: Http request
    :param promo: Promo object
    :return: promo, ok

    Подробная проверка некоторых промокодов, которые требуют некоторые условия
    """
    if promo.code == "auth":
        if request.user.is_anonymous:
            return "Для активации данного промокода необходимо авторизоавться", False

    return promo, True


def deactivate_promo_if_once(promo):
    if promo.once:
        promo.active = False
        promo.save()


def process_bag_promocode(total_price, user, promo, items=None, check=True):
    if not check:
        deactivate_promo_if_once(promo)
        # items = [item.item for item in items]

    return int(total_price * promo.discount / 100)


def process_delivery_promocode(delivery_price, user, promo, check=True):
    if not check:
        deactivate_promo_if_once(promo)

    if promo.code == "free_delivery":
        return 0

    return int(delivery_price)
