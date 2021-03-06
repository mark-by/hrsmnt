# Generated by Django 3.0.5 on 2020-06-29 18:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('leads', '0003_auto_20200629_2046'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='orderitem',
            options={'verbose_name': 'Заказанная вещь', 'verbose_name_plural': 'Заказанные вещи'},
        ),
        migrations.AddField(
            model_name='order',
            name='datetime',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='order',
            name='address',
            field=models.TextField(blank=True, null=True, verbose_name='Адрес доставки'),
        ),
        migrations.AlterField(
            model_name='order',
            name='delivery_type',
            field=models.CharField(choices=[('p', 'Почтой'), ('m', 'У метро Кивеская'), ('c', 'Куерьер')], max_length=1, verbose_name='Способ доставки'),
        ),
        migrations.AlterField(
            model_name='order',
            name='first_name',
            field=models.CharField(blank=True, max_length=32, null=True, verbose_name='Имя'),
        ),
        migrations.AlterField(
            model_name='order',
            name='patronymic',
            field=models.CharField(blank=True, max_length=32, null=True, verbose_name='Отчество'),
        ),
        migrations.AlterField(
            model_name='order',
            name='pay_way',
            field=models.CharField(max_length=4, verbose_name='Способ оплаты'),
        ),
        migrations.AlterField(
            model_name='order',
            name='postal_code',
            field=models.PositiveIntegerField(blank=True, null=True, verbose_name='Индекс'),
        ),
        migrations.AlterField(
            model_name='order',
            name='second_name',
            field=models.CharField(blank=True, max_length=32, null=True, verbose_name='Фамилия'),
        ),
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('r', 'Оформлен'), ('p', 'Оплачен'), ('c', 'Завершен')], default='r', max_length=1, verbose_name='Статус заказа'),
        ),
        migrations.AlterField(
            model_name='order',
            name='tel',
            field=models.CharField(max_length=15, verbose_name='Телефон'),
        ),
        migrations.AlterField(
            model_name='order',
            name='user',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='orders', to=settings.AUTH_USER_MODEL, verbose_name='Аккаунт покупателя'),
        ),
        migrations.AlterField(
            model_name='orderitem',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='leads.Item', verbose_name='Вещь'),
        ),
        migrations.AlterField(
            model_name='orderitem',
            name='size',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='leads.Counter', verbose_name='Размер'),
        ),
    ]
