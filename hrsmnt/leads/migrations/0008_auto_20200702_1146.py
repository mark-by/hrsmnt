# Generated by Django 3.0.5 on 2020-07-02 08:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leads', '0007_auto_20200701_1735'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='pay_notified',
            field=models.BooleanField(default=False, verbose_name='Пришло ли уведомление об оплате'),
        ),
        migrations.AlterField(
            model_name='order',
            name='paid',
            field=models.BooleanField(default=False, verbose_name='Оплачен'),
        ),
    ]
