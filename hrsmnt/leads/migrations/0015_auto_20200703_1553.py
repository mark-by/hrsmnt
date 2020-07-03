# Generated by Django 3.0.5 on 2020-07-03 12:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leads', '0014_delete_address'),
    ]

    operations = [
        migrations.AddField(
            model_name='counter',
            name='priority',
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('reserved', 'Оформлен'), ('paid', 'Оплачен'), ('on_delivery', 'В пути'), ('called', 'Созвонились'), ('completed', 'Завершен'), ('canceled', 'Отменен'), ('returned', 'Возвращен')], default='reserved', help_text='Оформлен - человек оформил заказ (требует оплаты налом);\n                                           Оплачен - человек уже оплатил безналом;\n                                           Созвонились - мы созвонились и договорились о встрече, если того требует способ доставки;\n                                           Завершен - Товар отдали, деньги получили, все довольны;\n                                           ', max_length=20, verbose_name='Статус заказа'),
        ),
    ]
