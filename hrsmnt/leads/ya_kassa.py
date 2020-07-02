from yandex_checkout import Configuration, Payment
from django.conf import settings
import uuid


def pay(value, order_id, email, items, delivery):
    Configuration.account_id = settings.YA_ACCOUNT_ID
    Configuration.secret_key = settings.YA_SECRET_KEY

    payment_items = [
        {"description": f'{item.item.title} [{item.size.title}]', "quantity": "1", "amount": {"value": item.item.price, "currency": "RUB"},
         "vat_code": 1} for item in items]
    if delivery:
        payment_items += [{"description": "Доставка", "quantity": "1", "amount": {"value": delivery, "currency": "RUB"},
                           "vat_code": 1}]

    payment = Payment.create({
        "amount": {
            "value": value,
            "currency": "RUB"
        },
        "confirmation": {
            "type": "embedded",
            "return_url": "https://test.hrsmnt.ru/#/"
        },
        "receipt": {
            "customer": {
                "email": email,
            },
            "items": payment_items
        },
        "capture": True,
        "description": f"Заказ №{order_id}"
    }, uuid.uuid4())

    return payment.confirmation.confirmation_token
