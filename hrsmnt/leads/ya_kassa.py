from yandex_checkout import Configuration, Payment
from django.conf import settings
import uuid


def pay(value, order_id):
    Configuration.account_id = settings.YA_ACCOUNT_ID
    Configuration.secret_key = settings.YA_SECRET_KEY

    payment = Payment.create({
        "amount": {
            "value": value,
            "currency": "RUB"
        },
        "confirmation": {
            "type": "embedded",
            "return_url": "https://test.hrsmnt.ru/#/"
        },
        "capture": True,
        "description": f"Заказ №{order_id}"
    }, uuid.uuid4())

    return payment.confirmation.confirmation_token
