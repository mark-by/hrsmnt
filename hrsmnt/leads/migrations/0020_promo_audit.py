# Generated by Django 3.0.5 on 2020-07-10 11:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leads', '0019_promo_discount'),
    ]

    operations = [
        migrations.AddField(
            model_name='promo',
            name='audit',
            field=models.CharField(choices=[('a', 'Для всех'), ('p', 'Для конкретного человека')], default='a', max_length=1),
        ),
    ]
