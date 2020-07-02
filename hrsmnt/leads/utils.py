from datetime import datetime

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def path_for_item_image(instance, file_name):
    return f"items/{instance.item.title}_item_image_{datetime.now()}"


def path_for_item_main_image(instance, file_name):
    return f"items/{instance.title}_main_image"


def path_for_item_back_image(instance, file_name):
    return f"items/{instance.title}_back_image"


def send_template_email(subject, template, context, to):
    html_message = render_to_string(template, context)
    plain_message = strip_tags(html_message)
    from_email = 'hrsmnt@hrsmnt.ru'
    send_mail(subject, plain_message, from_email, to, html_message=html_message)
    # + [from_email]
