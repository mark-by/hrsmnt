#!/bin/bash
source /home/mark/hrsmnt.ru/env/bin/activate
exec gunicorn -c "/home/mark/hrsmnt.ru/hrsmnt/gunicorn_config.py" hrsmnt.wsgi
