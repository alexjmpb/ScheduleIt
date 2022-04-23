# Generated by Django 4.0.3 on 2022-04-22 20:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calendar_app', '0008_calendarobjectexception_is_deleted_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='calendarobject',
            name='end_time',
            field=models.TimeField(default='15:32:39'),
        ),
        migrations.AddField(
            model_name='calendarobjectexception',
            name='end_time',
            field=models.TimeField(default='15:32:39'),
        ),
        migrations.AlterField(
            model_name='calendarobject',
            name='due_date',
            field=models.DateField(default='2022-04-22'),
        ),
        migrations.AlterField(
            model_name='calendarobject',
            name='start_time',
            field=models.TimeField(default='15:32:39'),
        ),
        migrations.AlterField(
            model_name='calendarobjectexception',
            name='due_date',
            field=models.DateField(default='2022-04-22'),
        ),
        migrations.AlterField(
            model_name='calendarobjectexception',
            name='start_time',
            field=models.TimeField(default='15:32:39'),
        ),
        migrations.AlterField(
            model_name='objectrecurrencepattern',
            name='final_date',
            field=models.DateField(default='2022-04-22'),
        ),
    ]
