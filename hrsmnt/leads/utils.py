from datetime import datetime


def path_for_item_image(instance, file_name):
    return f"items/{instance.item.title}_item_image_{datetime.now()}"


def path_for_item_main_image(instance, file_name):
    return f"items/{instance.title}_main_image"


def path_for_item_back_image(instance, file_name):
    return f"items/{instance.title}_back_image"

