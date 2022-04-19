# Generated by Django 4.0.3 on 2022-04-18 21:02

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calendar_app', '0007_remove_calendarobject_start_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='calendarobjectexception',
            name='is_deleted',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='calendarobject',
            name='start_time',
            field=models.TimeField(default='16:02:45'),
        ),
        migrations.AlterField(
            model_name='calendarobjectexception',
            name='start_time',
            field=models.TimeField(default='16:02:45'),
        ),
        migrations.AlterField(
            model_name='objectrecurrencepattern',
            name='final_date',
            field=models.DateField(default='2022-04-18'),
        ),
        migrations.AlterField(
            model_name='objectrecurrencepattern',
            name='recurrence',
            field=models.PositiveIntegerField(default=1, validators=[django.core.validators.MinValueValidator(1)]),
        ),
    ]
