# Generated by Django 5.1.5 on 2025-02-08 07:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('artwork', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='artwork',
            name='feedback',
            field=models.TextField(blank=True, null=True),
        ),
    ]
