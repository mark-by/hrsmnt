from datetime import datetime
from django.conf import settings

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def path_for_item_image(instance, file_name):
    return f"items/{instance.item.title}_{instance}"


def path_for_item_main_image(instance, file_name):
    return f"items/{instance.title}_main_image"


def path_for_item_back_image(instance, file_name):
    return f"items/{instance.title}_back_image"


def send_template_email(subject, template, context, to):
    html_message = render_to_string(template, context)
    plain_message = strip_tags(html_message)
    from_email = 'hrsmnt@hrsmnt.ru'
    if settings.EMAIL_NOTIFY:
        to += [from_email]
    send_mail(subject, plain_message, from_email, to, html_message=html_message)


def check_delivery_price(delivery_type, country):
    if delivery_type != 'post':
        return 0
    if country == 'Россия':
        return 350
    if country in ['Азербайджан', 'Армения', 'Белорусь', 'Казахстан', 'Киргизия', 'Молдавия',
                                        'Таджикистан', 'Узбекистан', 'Украина']:
        return 650
    return 650
