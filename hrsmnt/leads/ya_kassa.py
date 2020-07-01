from yandex_checkout import Configuration, Payment
import uuid


def pay(value, order_id):
    Configuration.account_id = '724176'
    Configuration.secret_key = 'test_pgXZUajk-HgoY6XlN-TFBjKzguMJkdotVXHQU0uZYpI'

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
