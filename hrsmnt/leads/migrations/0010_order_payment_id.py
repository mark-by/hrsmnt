# Generated by Django 3.0.5 on 2020-07-02 22:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leads', '0009_auto_20200702_1550'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='payment_id',
            field=models.TextField(blank=True, null=True),
        ),
    ]